import os
import time
from io import StringIO
from pathlib import Path

import requests
from rich.console import Console
from rich.live import Live
from rich.progress import Progress, SpinnerColumn, TimeElapsedColumn
from rich.table import Column, Table
from rich.terminal_theme import DIMMED_MONOKAI

try:
    from config import HAVELOC_API_KEY, JOB_COUNT_LIMIT
except:
    HAVELOC_API_KEY = os.getenv("HAVELOC_API_KEY")
    JOB_COUNT_LIMIT = 100

console = Console()

# Headers to make Haveloc think that this is a legit request :P
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.5",
    "API-KEY": HAVELOC_API_KEY,
    "Context-Type": "application/json",
    "Origin": "https://app.haveloc.com",
    "Connection": "keep-alive",
    "Referer": "https://app.haveloc.com/FresherJobs",
}

json_data = [
    {
        "key": "jobStatus",
        "operation": "NOT_EQUAL",
        "value": "CLOSED",
    },
]

# Get job listings
with Progress(
    SpinnerColumn(),
    *Progress.get_default_columns(),
    TimeElapsedColumn(),
    console=console,
    transient=True,
) as progress:
    progress.add_task("[magenta]Sending request to the Haveloc API", total=None)

    response = requests.post(
        f"https://app.haveloc.com/brokerage/jobViews?size={JOB_COUNT_LIMIT}&sort=lastModifiedDate,desc",
        headers=headers,
        json=json_data,
    ).json()

job_table = Table(
    "Company name",
    "Job title",
    Column("CTC", justify="right"),
    "Updated",
    "Job Type",
    "Job status",
    header_style="bold magenta",
    title="Jobs on Haveloc",
)


# format salary
def formatSalary(salary):
    if salary == 0:
        return "-"

    if salary < 100000:
        return f"{int(salary / 1000)}k"

    return f"{int(salary / 100000)} LPA"


def linkJobTitle(job):
    match job["jobType"]:
        case "FULL_TIME":
            return f"[link=https://app.haveloc.com/FresherJobs/jobs/{job['id']}]{job['jobTitle']}[/link]"
        case "INTERN":
            return (
                f"[link=https://app.haveloc.com/Interns/jobs/{job['id']}]{job['jobTitle']}[/link]"
            )
        case _:
            return job["jobTitle"]


# TODO: Print all job listings immediately, then update job listing row with more information later
with Live(
    job_table, auto_refresh=False, vertical_overflow="visible", console=console
) as live_table:
    for job in response["_embedded"]["entityModels"]:

        # for each job listing, request job details. If apply button is visible, we color it green
        job_response = requests.get(
            f"https://app.haveloc.com/brokerage/jobViews/{job['id']}", headers=headers
        ).json()

        # For testing, comment the above line and uncomment the below line
        # job_response = {"displayApplyButton": False}

        job_table.add_row(
            job["companyName"],
            linkJobTitle(job),
            formatSalary(job["maxCtc"]),
            str(job["lastModifiedDate"]),
            job["jobType"],
            ("[green]" if job_response["displayApplyButton"] else "[red]") + job["jobStatus"],
            style="green" if job_response["displayApplyButton"] else "",
        )

        live_table.refresh()

# Export to html
export_console = Console(record=True, file=StringIO(), width=120)
export_console.print(round(time.time()))
export_console.print(job_table)
export_console.save_html(
    "public/index.html",
    theme=DIMMED_MONOKAI,
    clear=False,
    code_format=Path("public/template.html").read_text(encoding="utf-8"),
)

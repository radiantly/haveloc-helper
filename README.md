# haveloc-helper

Because haveloc's interface can improve. A lot. [Try it online.](https://radiantly.github.io/haveloc-helper/)

![Demo](.github/demo.gif)

_(Legend: Green - job listings that can be applied to, Red - job listings already applied to or unavailable)_

## Usage

### Online

1. [Fork](https://github.com/radiantly/haveloc-helper/fork) this repository
2. Log in to haveloc, open the `Developer Tools` <kbd>F12</kbd> > `Console` and run `localStorage.getItem("myToken")` to get your haveloc API key.
3. Navigate to your repository `Settings` > `Secrets (Actions)` > `New repository secret`.

   **Name**: `HAVELOC_API_KEY`\
   **Value**: the API key from haveloc

4. Enable GitHub pages by going to `Settings` > `Pages`.

   **Source**: `gh-pages`\
   **Folder**: `/ (root)`

   Click save.

5. Finally, navigate to the `Actions` tab and click `I understand my workflows, go ahead and enable them` to update the site hourly. Visit `https://USERNAME.github.io/haveloc-helper/` to see the published site!

### On your computer

```sh
# Copy and populate the config file
cp config.sample.py config.py

# Install dependencies
python -m pip install -r requirements.txt

# Run script
python opportunities.py
```

## License

MIT

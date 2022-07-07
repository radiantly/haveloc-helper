# haveloc-helper

Because haveloc's interface can improve. A lot.

![Demo](.github/demo.gif)

## Usage

### Online

1. [Fork](https://github.com/radiantly/haveloc-helper/fork) this repository
2. Log in to haveloc, open the `Developer Tools` <kbd>F12</kbd> > `Console` and run `localStorage.getItem("myToken")` to get your haveloc API key.
3. Navigate to your repository `Settings` > `Secrets (Actions)` > `New repository secret`.

   **Name**: `HAVELOC_API_KEY`\
   **Value**: the token from haveloc

4. Enable GitHub pages by going to `Settings` > `Pages`.

   **Source**: `gh-pages`\
   **Folder**: `/ (root)`

   Click save.

5. Finally, navigate to the `Actions` tab and enable Actions to update the site hourly.

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

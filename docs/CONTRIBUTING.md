# Updating your Parish Pulse dashboard (Windows, macOS and Linux)

**You do not need Python, Git or QGIS to update an existing CSV indicator.** You need a GitHub account and permission to edit this repository (or create a pull request).

## First-time setup for a new parish

1. Open the **parish-pulse-data** template repository on GitHub and click **Use this template → Create a new repository**. Choose a public repository if you want a public GitHub Pages website.
2. Open `config/parish.yaml` using GitHub's pencil/edit control. Change the parish name, local authority, title and map settings. Commit the changes.
3. Open repository **Settings → Pages → Build and deployment** and choose **GitHub Actions** as the source.
4. Open **Actions**, enable workflows if GitHub asks, and run **Validate, build and publish Parish Pulse** using **Run workflow**. Wait for a green tick. The Pages URL appears under the workflow deployment and repository Settings → Pages.
5. The sample `example.csv` contains **illustrative values, not real parish measurements**. Replace it before using the site publicly. To create the parish's spatial boundary and hexagons, see `docs/SPATIAL_DATA.md`.

**Important:** Until `parish-pulse` version 1.1.0 has actually been released to PyPI, change `requirements.txt` to a Git URL for your published core repository at a tested commit or tag. The template cannot publish from a nonexistent PyPI release.

## Update a CSV in the browser (same on Windows, Mac and Linux)

1. Sign in to GitHub and open your parish repository.
2. Go to `data/metrics/` and select the CSV named in `config/metrics.yaml`.
3. Click the pencil icon to edit. Enter a new row in the form `2026-10-01,6,October survey`. Keep the header and existing data. Dates should be `YYYY-MM-DD`; values must be numbers, without units or thousands separators.
4. Click **Commit changes**. If you cannot edit the main branch, choose **Propose changes** and ask a maintainer to review the pull request.
5. Open **Actions** and check the latest run. Green means validation and publication succeeded. Red means no new site was deployed; click the failed step to see the error.
6. Open the public dashboard and refresh the page. Allow a short time for GitHub Pages deployment and browser caches.

## Update using Excel (Windows or Mac)

1. Download the CSV from GitHub (use the **Raw** button and save the file).
2. In Excel, use **Data → From Text/CSV** where available and select UTF-8 encoding; ensure the date column is treated as **Text** to avoid automatic date conversion.
3. Add or edit rows. Keep the first column as a date and the second as a numeric value. Do not add merged cells, totals, extra header lines or formulas that export as errors.
4. Save a copy as **CSV UTF-8 (Comma delimited) (.csv)**. Excel may warn that CSV does not preserve formatting: that is expected.
5. In GitHub, navigate to `data/metrics/`, choose **Add file → Upload files**, upload the replacement with **the exact same filename**, and commit. GitHub should show the changed file in the commit.
6. Check the Actions run as above.

## Update using LibreOffice Calc (Linux, Windows or Mac)

1. Download the CSV and open it in LibreOffice Calc.
2. In the import dialog select **Separated by: Comma**, **UTF-8**, and mark the date column as **Text**.
3. Edit values and choose **File → Save As → Text CSV (.csv)**. In the export dialog choose **UTF-8**, comma field delimiter and standard double-quote text delimiter.
4. Upload the replacement CSV to GitHub as described above and check Actions.

## Add a new indicator

Upload a CSV to `data/metrics/` and add an entry in `config/metrics.yaml` with `id`, `label`, `data_file`, `category`, `unit` and `chart_type` (`line`, `bar` or `pie`). The first CSV column is the date; the second is numeric. The build calculates the latest value and difference from the preceding non-empty observation. Avoid duplicate dates. A non-spatial indicator will appear as a dashboard card and, with at least two observations, as a chart.

## Common errors

- **Missing file**: the filename in `config/metrics.yaml` must match exactly, including capital letters.
- **Invalid number**: enter `12.5`, not `12.5%` or `1,250`.
- **Invalid date**: use `2026-10-01`, not a spreadsheet serial number.
- **Duplicate date**: each indicator can contain only one observation per date.
- **Validation failed**: click **Actions → failed workflow → Validate input data**. Correct the reported file and commit again.
- **No public site**: check **Settings → Pages** and ensure GitHub Actions is selected and the workflow has succeeded.

## Reviewing contributions

Contributors without write access can fork the repository, edit the CSV in their fork and open a pull request. Maintainers should review the data source and dates before merging. Never upload personal information or confidential datasets to a public repository.

# Parish Pulse data template

Use **Use this template** on GitHub to create one repository per parish. Configure `config/parish.yaml`, update `data/metrics/example.csv`, then enable GitHub Pages **GitHub Actions** deployment in repository Settings → Pages. Each commit to `main` validates the CSV data, builds a complete static site using the core package and publishes it to GitHub Pages.

**Start here:** [Contributor guide for Windows, Mac and Linux](docs/CONTRIBUTING.md). [Spatial data guide](docs/SPATIAL_DATA.md).

`requirements.txt` currently installs core from GitHub. **Replace `YOUR_USERNAME` with the actual owner of your core repository before enabling Actions.** For reproducible deployments, pin a release tag or commit rather than `main`. The large national GeoPackages stay local; see [local GeoPackage setup](docs/SETUP-LOCAL-GPKG.md).

The included example values are fictitious. Replace them with documented parish data before presenting results as facts.

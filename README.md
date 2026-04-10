# StudyConnectIndia

Static website for a home tuition service covering Lucknow, Ayodhya, Basti and nearby areas.

## Project Structure

- `index.html` — landing page
- `pages/` — secondary pages such as `about.html`, `contact.html`, `find-tutor.html`, etc.
- `css/` — styles
- `js/` — JavaScript logic
- `assets/` — images and icons

## GitHub Repository Setup

1. Open the project folder in a terminal.
2. Initialize git:

```bash
git init
```

3. Add files and commit:

```bash
git add .
git commit -m "Initial commit"
```

4. Create a GitHub repository on github.com.
5. Add the remote and push:

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

## Deploy to Netlify

This is a static site, so the publish directory is the project root.

### Option 1: Netlify Git deployment

1. Log in to Netlify.
2. Choose "New site from Git".
3. Connect your GitHub account.
4. Select this repository.
5. Set the branch to `main`.
6. Set the publish directory to `.`.
7. Deploy site.

### Option 2: Drag-and-drop deploy

1. Open Netlify.
2. Go to "Sites".
3. Drag the entire project folder or a ZIP of the folder into the Netlify drop zone.

## Local Preview

Open `index.html` in your browser, or use a local static server if you want a local preview.

Example with Python:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

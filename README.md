# Personal Portfolio Website - Darshan Hegde

A modern, highly responsive, and premium personal portfolio website designed for **Darshan Hegde** (MCA Student, Aspiring Software Engineer, and Cloud & DevOps Enthusiast). 

This website features smooth keyframe animations, scroll reveals, particle effects in the hero section, light/dark mode persistence, education timeline, dynamic project rendering via JSON data, interactive SVGs representing GitHub contribution graphs, a fully functional certifications lightbox modal, and deployment specs.

---

## 📂 Project Structure

```
Portfolio/
├── index.html          # Main HTML structure with SEO tags and modals
├── style.css           # Styling with variable theme configurations
├── script.js           # Interactive triggers (typing, canvas, filters)
├── resume.pdf          # Resume document (placeholder initialized)
│
├── assets/
│   ├── images/
│   │   ├── profile.png        # Profile avatar
│   │   ├── portfolioops.png   # PortfolioOps project banner
│   │   ├── marketplace.png    # Local Service Marketplace banner
│   │   └── certificates/
│   │       └── placeholder.png # Lightbox and download certificate backup
│   └── icons/
│
├── data/
│   └── projects.json   # JSON file containing project information
│
└── README.md           # Documentation and Deployment Guide
```

---

## 🛠️ Personal Customization Guide

This template has been built with clean, decoupled assets, meaning you can customize all details without modifying structural code:

1. **Replace Profile Image**:
   - Save your professional portrait as `profile.png` (or `.jpg`) and overwrite `assets/images/profile.png`.
   - Update the file format path in `index.html` (inside `.profile-frame img` tag) if you switch to `.jpg`.

2. **Replace Resume File**:
   - Overwrite `resume.pdf` in the root folder with your actual PDF resume. The download button is already configured to fetch this file.

3. **Update Certificates**:
   - Save your certificate images or PDFs inside `assets/images/certificates/`.
   - Edit the `certData` mapping in `script.js` (lines 450+) or the static buttons inside `index.html` (under `#certifications`) to match the new filenames and issuing organizations.

4. **Add/Modify Projects**:
   - Open `data/projects.json` and customize the entries. You can add new objects to the array using the following schema:
     ```json
     {
       "id": "unique-id",
       "title": "Project Title",
       "category": "web OR devops",
       "status": "Completed OR In Progress",
       "image": "assets/images/your-project-banner.png",
       "description": "Short project description...",
       "technologies": ["HTML", "CSS", "React.js"],
       "features": [
         "Key feature bullet 1",
         "Key feature bullet 2"
       ],
       "github": "https://github.com/username/project",
       "demo": "https://username.github.io/project"
     }
     ```

5. **Update Links & Profiles**:
   - Search for `yourusername`, `yourprofile`, and `your-email@example.com` in `index.html` and `script.js` and replace them with your actual GitHub username, LinkedIn URL slug, and contact email.

---

## 🚀 DevOps & AWS S3 Deployment Guide (PortfolioOps)

This portfolio is optimized for cloud hosting on AWS S3, leveraging automation for zero-downtime updates.

### Step 1: AWS S3 Static Web Hosting Configuration
1. Log in to the **AWS Management Console** and navigate to **S3**.
2. Click **Create bucket**, name it (e.g., `darshan-hegde-portfolio`), select your region, and **uncheck** "Block *all* public access" (public read access is required for static website hosting).
3. Open the newly created bucket, go to the **Properties** tab, scroll to **Static website hosting**, click **Edit**, choose **Enable**, and set:
   - Index document: `index.html`
   - Error document: `index.html`
4. Go to the **Permissions** tab, select **Bucket Policy**, and add the public read access policy (replace `YOUR-BUCKET-NAME` with your actual bucket name):
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Sid": "PublicReadGetObject",
               "Effect": "Allow",
               "Principal": "*",
               "Action": "s3:GetObject",
               "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
           }
       ]
   }
   ```

### Step 2: Configure IAM User Security (Least Privilege)
To enable automated deployments via GitHub Actions, create a secure deployment user:
1. Navigate to AWS **IAM** (Identity and Access Management) and click **Users** -> **Create user** (e.g., `github-actions-portfolio-deployer`).
2. Do **not** give the user AWS Console access. Select **Attach policies directly** -> **Create policy**.
3. Under the JSON tab of the policy editor, paste the following policy containing limited permissions (only what is needed to sync files to S3, replacing `YOUR-BUCKET-NAME`):
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Effect": "Allow",
               "Action": [
                   "s3:PutObject",
                   "s3:GetObject",
                   "s3:ListBucket",
                   "s3:DeleteObject"
               ],
               "Resource": [
                   "arn:aws:s3:::YOUR-BUCKET-NAME",
                   "arn:aws:s3:::YOUR-BUCKET-NAME/*"
               ]
           }
       ]
   }
   ```
4. Save policy as `S3PortfolioDeployPolicy` and attach it to your IAM user.
5. Create and download **Access Key Credentials** (Access Key ID and Secret Access Key) for this user.

### Step 3: Setup GitHub Actions CI/CD Pipeline
1. In your GitHub repository, navigate to **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**.
2. Add the following secrets:
   - `AWS_ACCESS_KEY_ID`: Your IAM user's Access Key ID
   - `AWS_SECRET_ACCESS_KEY`: Your IAM user's Secret Access Key
   - `AWS_S3_BUCKET`: The exact name of your S3 bucket (e.g., `darshan-hegde-portfolio`)
   - `AWS_REGION`: The AWS region of your bucket (e.g., `us-east-1` or `ap-south-1`)
3. In your local repository root, create the directory structure `.github/workflows/`.
4. Create a deployment workflow file named `deploy.yml` inside `.github/workflows/` and add the following contents:
   ```yaml
   name: Deploy Portfolio to AWS S3

   on:
     push:
       branches:
         - main

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout Code
           uses: actions/checkout@v3

         - name: Configure AWS Credentials
           uses: aws-actions/configure-aws-credentials@v2
           with:
             aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
             aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
             aws-region: ${{ secrets.AWS_REGION }}

         - name: Sync Files to AWS S3 Bucket
           run: |
             aws s3 sync . s3://${{ secrets.AWS_S3_BUCKET }} --delete --exclude ".git/*" --exclude ".github/*" --exclude "README.md"
   ```
5. Commit and push this directory structure to your `main` branch. GitHub Actions will automatically deploy your portfolio code to AWS S3 on every push!

# Varsomics CLI

A CLI to interact with Varsomics infrastructure

## Installation

### Node & npm

First you'll need to have node and npm installed.

This project was generated with version 14.15 of Node.

To install it, follow the following steps:

1) If you don't have node installed in your computer
    - You can download it directly from their [website](https://nodejs.org/en/). You can try to download the latest stable version (LTS).
      If it doesn't work, you may choose exactly [version 14.15](https://nodejs.org/download/release/v14.15.4/).

2) If you have an older version of node installed in your computer.
    - It is useful to download a version manager for node. This way, you can manage multiple node versions in your computer.
    - One possible lib is [nvm](https://github.com/nvm-sh/nvm).
        - Install `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash`.
        - Run `nvm install [your version here] && nvm use [version]`

### Installing the library

Run `npm install -g vars-cli`

## Using the CLI

There are a few important commands when using this CLI:

### Authenticating (`vars-cli auth`)

To perform any action, you must be authenticated. You'll use your varstation account credentials
to authenticate.

### Uploading a Routine (`vars-cli upload_routine <directory_path> <routine_name>`)

With this command you will upload the files from a local directory into our S3 bucket. It requires the 
following arguments:
- directory_path -> The path to the directory  where the files are located.
- routine_name -> The name of the routine that will be created in Varstation afterwards.

The are also some optionals arguments:
- -e/--exclude -> Files inside the directory that you don't want to upload.

Example:
`vars-cli upload_routine ../upload_routine_directory/ MY_TSO_ROUTINE --exclude boring_file.fastq`

### [Development Only] Changing environment (`vars-cli env`)

By default, all the actions will be performed on our production infrastructure. However, you can
choose to make your actions on other environments if necessary. Use this command to change to the
environments you want.

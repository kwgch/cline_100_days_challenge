# Local File Translation Application

This application is a web-based tool that allows users to select a local text file and translate it into a specified language. It is built using HTML, JavaScript, and CSS, and all processing is done client-side. It utilizes the unofficial Google Translate API for translation.

## Features

-   **File Selection**: Allows users to select a local text file in their browser.
-   **Translation Settings**: Allows users to select the target language for translation (source language is automatically detected).
-   **Preview Display**:
    -   Displays a preview of the original file.
    -   Displays a preview of the translated result.
-   **Translation Execution**: Executes the translation process with a button click.
-   **Translation Result Saving**: Allows users to download the translated text as a file.

## Supported File Formats

-   Text files (.txt)
-   Other text-based files (formats that can be read as text)

## User Interface

-   Simple and intuitive UI
-   Responsive design
-   Split view for comparing the original and translated text

## Non-Functional Requirements

-   **Security**: All processing is done client-side, and files are not uploaded to a server.
-   **Performance**: Efficiently handles large files.
-   **Offline Support**: Functions other than the translation API work offline.

## Architecture

The application is built with pure front-end technologies (HTML, CSS, JavaScript). The translation function uses the unofficial Google Translate API.

```
index.html  -- Main HTML file
│
├── css/
│   └── styles.css  -- Style definitions
│
├── js/
│   ├── main.js     -- Main application logic
│   ├── fileHandler.js  -- File reading/saving processing
│   └── translator.js  -- Translation processing
```

## How to Use

1.  Open `index.html` in your browser.
2.  Select a text file using the file input.
3.  Choose the target language from the dropdown menu.
4.  Click the "Translate" button.
5.  Review the translated text in the "Translation Result" preview.
6.  Click the "Download Translation" button to save the translated text to a file.

## Technologies Used

-   HTML
-   CSS
-   JavaScript
-   Google Translate API (unofficial)

## Notes

-   This application uses an unofficial Google Translate API, which may be subject to change or limitations.
-   The application is client-side only, which provides privacy and security but may limit performance for large files.

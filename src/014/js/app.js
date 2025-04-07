document.addEventListener('DOMContentLoaded', () => {
    const numRecordsInput = document.getElementById('numRecords');
    const generateButton = document.getElementById('generate');
    const dataTableBody = document.getElementById('dataTable').querySelector('tbody');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const pageInfoSpan = document.getElementById('pageInfo');
    const exportCSVButton = document.getElementById('exportCSV');
    const exportJSONButton = document.getElementById('exportJSON');

    let data = [];
    let currentPage = 1;
    const recordsPerPage = 10;

    generateButton.addEventListener('click', () => {
        const numRecords = parseInt(numRecordsInput.value);
        data = generateData(numRecords);
        currentPage = 1;
        renderTable();
    });

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < numPages()) {
            currentPage++;
            renderTable();
        }
    });

    exportCSVButton.addEventListener('click', () => {
        exportToCSV(data);
    });

    exportJSONButton.addEventListener('click', () => {
        exportToJSON(data);
    });

    function generateData(numRecords) {
        const generatedData = [];
        for (let i = 0; i < numRecords; i++) {
            generatedData.push(generatePerson(i + 1));
        }
        return generatedData;
    }

    function renderTable() {
        dataTableBody.innerHTML = '';
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        const pageData = data.slice(startIndex, endIndex);

        pageData.forEach(person => {
            const row = dataTableBody.insertRow();
            row.insertCell().textContent = person.id;
            row.insertCell().textContent = person.name;
            row.insertCell().textContent = person.age;
            row.insertCell().textContent = person.gender;
            row.insertCell().textContent = person.phone;
            row.insertCell().textContent = person.email;
        });

        pageInfoSpan.textContent = `${currentPage}/${numPages()}`;
    }

    function numPages() {
        return Math.ceil(data.length / recordsPerPage);
    }

    // Import functions from other modules
    const { generatePerson } = window.generator;
    const { exportToCSV, exportToJSON } = window.exporter;

    // Initial render
    renderTable();
});

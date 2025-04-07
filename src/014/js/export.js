(function() {
    function exportToCSV(data) {
        const csvRows = [];
        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(','));

        data.forEach(row => {
            const values = headers.map(header => {
                return row[header];
            });
            csvRows.push(values.join(','));
        });

        const csvString = csvRows.join('\\n');
        downloadFile(csvString, 'data.csv', 'text/csv');
    }

    function exportToJSON(data) {
        const jsonString = JSON.stringify(data, null, 2);
        downloadFile(jsonString, 'data.json', 'application/json');
    }

    function downloadFile(data, filename, type) {
        const file = new Blob([data], {type: type});
        const a = document.createElement('a');
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    // Expose the export functions to the global scope
    window.exporter = {
        exportToCSV: exportToCSV,
        exportToJSON: exportToJSON
    };
})();

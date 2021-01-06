function getFile(){
  const status = document.getElementById('status');
  const output = document.getElementById('output');
  document.getElementById('dataFile').addEventListener('change', function()
    {
      const file = event.target.files[0];
      if (!file.type) {
        status.textContent = 'Error: The File.type property does not appear to be supported on this browser.';
        output.textContent = '';
        return;
        }
      if (!file.type.match('text.*')) {
        status.textContent = 'Error: The selected file does not appear to be an text/plain.'
        output.textContent = '';
        return;
      }
      if (file.size < 5) {
        status.textContent = 'Error: The selected file does not contain enough data.'
        output.textContent = '';
        return;
      }
      const df = new FileReader();
      df.onload = (e) => {
        var f = e.target.result;
        var lines = (f.split(/[\r\n]+/g)).filter(Boolean);
        procesingData = processData(lines);
        output.innerHTML = dataTable(procesingData);
        status.textContent = '';
      }
      df.readAsText(file);
    }
  )
}

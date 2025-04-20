document.addEventListener('DOMContentLoaded', function() {
    const entryForm = document.getElementById('entryForm');
    const entriesBody = document.getElementById('entriesBody');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const exportBtn = document.getElementById('exportBtn'); // Add this line
    
    // Load entries from localStorage when page loads
    loadEntries();
    
    // Form submission handler
    entryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const rollno = document.getElementById('rollno').value;
        const course = document.getElementById('course').value;
        const time = document.getElementById('time').value;
        
        // Create new entry object
        const entry = {
            name,
            rollno,
            course,
            time
        };
        
        // Add entry to the system
        addEntry(entry);
        
        // Clear the form
        entryForm.reset();
    });
    
    // Search functionality
    searchBtn.addEventListener('click', searchEntries);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchEntries();
        }
    });
    
    // Export functionality
    exportBtn.addEventListener('click', exportToTxt); // Add this line
    
    function addEntry(entry) {
        // Get existing entries from localStorage
        let entries = JSON.parse(localStorage.getItem('collegeEntries')) || [];
        
        // Add new entry
        entries.push(entry);
        
        // Save back to localStorage
        localStorage.setItem('collegeEntries', JSON.stringify(entries));
        
        // Refresh the entries list
        loadEntries();
    }
    
    function loadEntries(filter = '') {
        // Get entries from localStorage
        let entries = JSON.parse(localStorage.getItem('collegeEntries')) || [];
        
        // Filter entries if search term exists
        if (filter) {
            const searchTerm = filter.toLowerCase();
            entries = entries.filter(entry => 
                entry.name.toLowerCase().includes(searchTerm) || 
                entry.rollno.toLowerCase().includes(searchTerm)
            );
        }
        
        // Clear the table body
        entriesBody.innerHTML = '';
        
        // Add each entry to the table
        entries.forEach((entry, index) => {
            const row = document.createElement('tr');
            
            const nameCell = document.createElement('td');
            nameCell.textContent = entry.name;
            
            const rollnoCell = document.createElement('td');
            rollnoCell.textContent = entry.rollno;
            
            const courseCell = document.createElement('td');
            courseCell.textContent = entry.course;
            
            const timeCell = document.createElement('td');
            timeCell.textContent = entry.time;
            
            const actionCell = document.createElement('td');
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => deleteEntry(index));
            actionCell.appendChild(deleteBtn);
            
            row.appendChild(nameCell);
            row.appendChild(rollnoCell);
            row.appendChild(courseCell);
            row.appendChild(timeCell);
            row.appendChild(actionCell);
            
            entriesBody.appendChild(row);
        });
    }
    
    function deleteEntry(index) {
        if (confirm('Are you sure you want to delete this entry?')) {
            // Get entries from localStorage
            let entries = JSON.parse(localStorage.getItem('collegeEntries')) || [];
            
            // Remove the entry at the specified index
            entries.splice(index, 1);
            
            // Save back to localStorage
            localStorage.setItem('collegeEntries', JSON.stringify(entries));
            
            // Refresh the entries list
            loadEntries(searchInput.value.trim());
        }
    }
    
    function searchEntries() {
        const searchTerm = searchInput.value.trim();
        loadEntries(searchTerm);
    }
    
    function exportToTxt() {
        // Get all entries from localStorage
        const entries = JSON.parse(localStorage.getItem('collegeEntries')) || [];
        
        if (entries.length === 0) {
            alert('No entries to export!');
            return;
        }
        
        // Create text content
        let txtContent = 'College Gate Entries\n\n';
        txtContent += 'Name\tRoll No\tCourse\tEntry Time\n';
        txtContent += '----------------------------------------\n';
        
        entries.forEach(entry => {
            txtContent += `${entry.name}\t${entry.rollno}\t${entry.course}\t${entry.time}\n`;
        });
        
        // Create download link
        const blob = new Blob([txtContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `college_entries_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Set current time as default
    document.getElementById('time').value = getCurrentTime();
    
    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
});
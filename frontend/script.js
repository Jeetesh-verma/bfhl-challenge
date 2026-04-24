// Configuration
const API_URL = 'http://localhost:5000'; // Change this when deploying
// const API_URL = 'https://your-deployed-api.com'; // For production

// DOM Elements
const inputArea = document.getElementById('inputArea');
const submitBtn = document.getElementById('submitBtn');
const exampleBtn = document.getElementById('exampleBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsSection = document.getElementById('resultsSection');
const errorSection = document.getElementById('errorSection');
const hierarchiesContainer = document.getElementById('hierarchiesContainer');
const invalidSection = document.getElementById('invalidSection');
const duplicateSection = document.getElementById('duplicateSection');

// Example data
const EXAMPLE_DATA = `A->B
A->C
B->D
C->E
E->F
X->Y
Y->Z
Z->X
P->Q
Q->R
G->H
G->I
hello
1->2
A->`;

// Event Listeners
submitBtn.addEventListener('click', handleSubmit);
exampleBtn.addEventListener('click', loadExample);
resetBtn.addEventListener('click', resetForm);

// Handle Submit
async function handleSubmit() {
    const input = inputArea.value.trim();

    if (!input) {
        showError('Please enter at least one edge!');
        return;
    }

    // Parse input
    const edges = input.split('\n').filter(line => line.trim() !== '');

    if (edges.length === 0) {
        showError('Please enter at least one edge!');
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');

    try {
        const response = await fetch(`${API_URL}/bfhl`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: edges })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        displayResults(result);
        errorSection.classList.add('hidden');
    } catch (error) {
        console.error('Error:', error);
        showError(`API Error: ${error.message}. Make sure the backend is running on ${API_URL}`);
    } finally {
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
    }
}

// Display Results
function displayResults(data) {
    resultsSection.classList.remove('hidden');

    // Update summary
    document.getElementById('totalTrees').textContent = data.summary.total_trees;
    document.getElementById('totalCycles').textContent = data.summary.total_cycles;
    document.getElementById('largestRoot').textContent = data.summary.largest_tree_root || '-';

    // Display hierarchies
    hierarchiesContainer.innerHTML = '';
    data.hierarchies.forEach((hierarchy, index) => {
        const card = createHierarchyCard(hierarchy, index);
        hierarchiesContainer.appendChild(card);
    });

    // Display invalid entries
    if (data.invalid_entries && data.invalid_entries.length > 0) {
        invalidSection.classList.remove('hidden');
        const invalidList = document.getElementById('invalidList');
        invalidList.innerHTML = data.invalid_entries
            .map(entry => `<span class="error-badge">${escapeHtml(entry)}</span>`)
            .join('');
    } else {
        invalidSection.classList.add('hidden');
    }

    // Display duplicate edges
    if (data.duplicate_edges && data.duplicate_edges.length > 0) {
        duplicateSection.classList.remove('hidden');
        const duplicateList = document.getElementById('duplicateList');
        duplicateList.innerHTML = data.duplicate_edges
            .map(edge => `<span class="error-badge">${escapeHtml(edge)}</span>`)
            .join('');
    } else {
        duplicateSection.classList.add('hidden');
    }

    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Create Hierarchy Card
function createHierarchyCard(hierarchy, index) {
    const card = document.createElement('div');
    card.className = `hierarchy-card ${hierarchy.has_cycle ? 'cycle' : ''}`;

    const headerHTML = `
        <div class="hierarchy-header">
            <span class="hierarchy-root">${hierarchy.root}</span>
            <div>
                ${hierarchy.has_cycle ? '<span class="badge badge-cycle">Cycle Detected</span>' : ''}
                ${hierarchy.depth ? `<span class="badge badge-depth">Depth: ${hierarchy.depth}</span>` : ''}
            </div>
        </div>
    `;

    const treeHTML = hierarchy.has_cycle ? 
        '<div class="tree-view" style="color: var(--danger-color); font-weight: 600;">⚠️ Cyclic group - No valid tree</div>' :
        `<div class="tree-view">${renderTree(hierarchy.tree, hierarchy.root)}</div>`;

    card.innerHTML = headerHTML + treeHTML;
    return card;
}

// Render Tree Structure - Build complete HTML at once
function renderTree(treeObj, rootNode) {
    let html = `<div class="tree-line"><span class="tree-root">📦 ${rootNode}</span></div>`;
    
    // Helper to recursively render children
    function renderNode(nodeObj, prefix = '') {
        let nodeHtml = '';
        const childKeys = Object.keys(nodeObj).sort();
        
        childKeys.forEach((childName, index) => {
            const isLast = index === childKeys.length - 1;
            const connector = isLast ? '└── ' : '├── ';
            const extension = isLast ? '    ' : '│   ';
            
            // Add current child node
            nodeHtml += `<div class="tree-line">${prefix}${connector}<span class="tree-node">📄 ${childName}</span></div>`;
            
            // Recursively add descendants
            const grandchildren = nodeObj[childName];
            if (grandchildren && Object.keys(grandchildren).length > 0) {
                nodeHtml += renderNode(grandchildren, prefix + extension);
            }
        });
        
        return nodeHtml;
    }
    
    // Get children of root and render them
    const rootChildren = treeObj[rootNode] || {};
    if (Object.keys(rootChildren).length > 0) {
        html += renderNode(rootChildren);
    }
    
    return html;
}

// Load Example
function loadExample() {
    inputArea.value = EXAMPLE_DATA;
    inputArea.focus();
}

// Reset Form
function resetForm() {
    inputArea.value = '';
    resultsSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    hierarchiesContainer.innerHTML = '';
    inputArea.focus();
}

// Show Error
function showError(message) {
    errorSection.textContent = message;
    errorSection.classList.remove('hidden');
    setTimeout(() => {
        errorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Utility: Escape HTML
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Auto-load example on page load for demonstration
window.addEventListener('load', () => {
    console.log('Frontend loaded. API URL:', API_URL);
});

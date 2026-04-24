/**
 * Validates if an entry is a valid node format (X->Y where X and Y are uppercase letters)
 */
function isValidNode(entry) {
  if (typeof entry !== 'string') return false;
  
  const trimmed = entry.trim();
  if (trimmed === '') return false;
  
  // Check format: single uppercase letter -> single uppercase letter
  const pattern = /^[A-Z]->[A-Z]$/;
  if (!pattern.test(trimmed)) return false;
  
  // Check for self-loops
  const [parent, child] = trimmed.split('->');
  if (parent === child) return false;
  
  return true;
}

/**
 * Detects if a graph has a cycle using DFS
 */
function hasCycle(graph, startNode) {
  const visited = new Set();
  const recursionStack = new Set();

  function dfs(node) {
    visited.add(node);
    recursionStack.add(node);

    const children = graph[node] || [];
    for (const child of children) {
      if (!visited.has(child)) {
        if (dfs(child)) return true;
      } else if (recursionStack.has(child)) {
        return true;
      }
    }

    recursionStack.delete(node);
    return false;
  }

  return dfs(startNode);
}

/**
 * Builds a tree structure recursively
 */
function buildTree(graph, root) {
  const visited = new Set();

  function buildNode(node) {
    if (visited.has(node)) return {};
    visited.add(node);

    const children = graph[node] || [];
    const tree = {};

    for (const child of children) {
      tree[child] = buildNode(child);
    }

    return tree;
  }

  return buildNode(root);
}

/**
 * Calculates the depth of a tree (longest root-to-leaf path)
 */
function calculateDepth(tree, node = null) {
  if (node === null) {
    // Initial call - find the root (first key)
    const nodes = Object.keys(tree);
    if (nodes.length === 0) return 0;
    node = nodes[0];
  }

  const children = tree[node];
  if (!children || Object.keys(children).length === 0) {
    return 1; // Leaf node
  }

  let maxDepth = 0;
  for (const child of Object.keys(children)) {
    maxDepth = Math.max(maxDepth, calculateDepth(children, child));
  }

  return maxDepth + 1;
}

/**
 * Finds all connected components (trees) in a graph
 * Each component is rooted at a node with no incoming edges
 */
function findConnectedComponents(edges) {
  const graph = {};
  const incomingEdges = {};
  const allNodes = new Set();

  // Build adjacency list and track incoming edges
  for (const [parent, child] of edges) {
    allNodes.add(parent);
    allNodes.add(child);
    if (!graph[parent]) graph[parent] = [];
    graph[parent].push(child);
    if (!incomingEdges[child]) incomingEdges[child] = 0;
    incomingEdges[child]++;
  }

  // Initialize incoming edge count for all nodes
  for (const node of allNodes) {
    if (!incomingEdges[node]) incomingEdges[node] = 0;
  }

  const visited = new Set();
  const components = [];

  // DFS to find all descendants
  function dfs(node, component) {
    visited.add(node);
    component.add(node);

    if (graph[node]) {
      for (const child of graph[node]) {
        if (!visited.has(child)) {
          dfs(child, component);
        }
      }
    }
  }

  // Find all roots (nodes with no incoming edges) and build components from them
  for (const node of allNodes) {
    if (incomingEdges[node] === 0 && !visited.has(node)) {
      const component = new Set();
      dfs(node, component);
      components.push(component);
    }
  }

  // For pure cycles (all nodes have incoming edges), group together
  if (visited.size < allNodes.size) {
    const remaining = new Set(allNodes);
    for (const node of visited) {
      remaining.delete(node);
    }
    if (remaining.size > 0) {
      components.push(remaining);
    }
  }

  return components;
}

/**
 * Main processor function
 */
function processHierarchies(data) {
  const invalidEntries = [];
  const duplicateEdges = [];
  const validEdges = [];
  const seenEdges = new Set();
  const childParents = {}; // Track which node has which parent

  // Validate and process entries
  for (const entry of data) {
    const trimmed = (typeof entry === 'string') ? entry.trim() : '';

    if (!isValidNode(trimmed)) {
      invalidEntries.push(typeof entry === 'string' ? entry : String(entry));
    } else {
      const [parent, child] = trimmed.split('->');
      const edgeKey = `${parent}->${child}`;

      if (seenEdges.has(edgeKey)) {
        // Duplicate of exact same edge
        duplicateEdges.push(edgeKey);
      } else {
        seenEdges.add(edgeKey);
        
        // Check if this child already has a parent (multi-parent/diamond case)
        if (childParents[child] && childParents[child] !== parent) {
          // Silently discard - don't add to edges or any error list
          continue;
        }
        
        childParents[child] = parent;
        validEdges.push([parent, child]);
      }
    }
  }

  // Remove duplicates from duplicateEdges
  const uniqueDuplicates = [...new Set(duplicateEdges)];

  // Find connected components
  const components = findConnectedComponents(validEdges);

  // Build graph from valid edges
  const graph = {};
  const childNodes = new Set();

  for (const [parent, child] of validEdges) {
    if (!graph[parent]) graph[parent] = [];
    graph[parent].push(child);
    childNodes.add(child);
  }

  // Process each component
  const hierarchies = [];
  let largestDepth = 0;
  let largestRoot = null;
  let totalTrees = 0;
  let totalCycles = 0;

  for (const component of components) {
    // Find root (node that never appears as a child in this component)
    let root = null;
    const componentArray = Array.from(component);

    for (const node of componentArray) {
      if (!childNodes.has(node)) {
        root = node;
        break;
      }
    }

    // If no root found (pure cycle), use lexicographically smallest node
    if (!root) {
      root = componentArray.sort()[0];
    }

    // Check for cycle
    let cycleExists = false;
    if (root) {
      cycleExists = hasCycle(graph, root);
    }

    if (cycleExists) {
      hierarchies.push({
        root,
        tree: {},
        has_cycle: true
      });
      totalCycles++;
    } else {
      // Build tree
      const tree = buildTree(graph, root);
      const wrappedTree = { [root]: tree };
      const depth = calculateDepth(wrappedTree);

      hierarchies.push({
        root,
        tree: tree.length === 0 ? { [root]: {} } : { [root]: tree },
        depth
      });

      totalTrees++;

      // Track largest tree
      if (depth > largestDepth) {
        largestDepth = depth;
        largestRoot = root;
      } else if (depth === largestDepth && root < largestRoot) {
        largestRoot = root;
      }
    }
  }

  // User info (update these with your actual details)
  const result = {
    user_id: "yourname_ddmmyyyy",
    email_id: "your.email@college.edu",
    college_roll_number: "XXCSXXXX",
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: uniqueDuplicates,
    summary: {
      total_trees: totalTrees,
      total_cycles: totalCycles,
      largest_tree_root: largestRoot || null
    }
  };

  return result;
}

module.exports = { processHierarchies };

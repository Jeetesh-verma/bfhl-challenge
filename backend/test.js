const { processHierarchies } = require('./processor');

// Test cases based on the specification
const testCases = [
  {
    name: "Example from spec",
    input: [
      "A->B", "A->C", "B->D", "C->E", "E->F",
      "X->Y", "Y->Z", "Z->X",
      "P->Q", "Q->R",
      "G->H", "G->H", "G->I",
      "hello", "1->2", "A->"
    ],
    expectedTrees: 3,
    expectedCycles: 1,
    expectedInvalid: 3,
    expectedDuplicates: 1
  },
  {
    name: "Simple tree",
    input: ["A->B", "B->C", "C->D"],
    expectedTrees: 1,
    expectedCycles: 0,
    expectedInvalid: 0,
    expectedDuplicates: 0
  },
  {
    name: "Multiple independent trees",
    input: ["A->B", "X->Y", "P->Q"],
    expectedTrees: 3,
    expectedCycles: 0,
    expectedInvalid: 0,
    expectedDuplicates: 0
  },
  {
    name: "Cycle detection",
    input: ["A->B", "B->C", "C->A"],
    expectedTrees: 0,
    expectedCycles: 1,
    expectedInvalid: 0,
    expectedDuplicates: 0
  },
  {
    name: "Validation tests",
    input: ["hello", "1->2", "AB->C", "A->", "A->A", ""],
    expectedTrees: 0,
    expectedCycles: 0,
    expectedInvalid: 6,
    expectedDuplicates: 0
  },
  {
    name: "Diamond pattern (multi-parent discarded)",
    input: ["A->D", "B->D", "D->E"],
    expectedTrees: 1,
    expectedCycles: 0,
    expectedInvalid: 0,
    expectedDuplicates: 0
  }
];

// Run tests
let passed = 0;
let failed = 0;

console.log('🧪 Running Backend Tests...\n');
console.log('='.repeat(80));

testCases.forEach((test, index) => {
  const result = processHierarchies(test.input);
  
  const treesMatch = result.summary.total_trees === test.expectedTrees;
  const cyclesMatch = result.summary.total_cycles === test.expectedCycles;
  const invalidMatch = result.invalid_entries.length === test.expectedInvalid;
  const duplicatesMatch = result.duplicate_edges.length === test.expectedDuplicates;
  
  const testPassed = treesMatch && cyclesMatch && invalidMatch && duplicatesMatch;
  
  if (testPassed) {
    console.log(`✅ TEST ${index + 1}: ${test.name}`);
    passed++;
  } else {
    console.log(`❌ TEST ${index + 1}: ${test.name}`);
    failed++;
    if (!treesMatch) console.log(`   ❌ Trees: Expected ${test.expectedTrees}, got ${result.summary.total_trees}`);
    if (!cyclesMatch) console.log(`   ❌ Cycles: Expected ${test.expectedCycles}, got ${result.summary.total_cycles}`);
    if (!invalidMatch) console.log(`   ❌ Invalid: Expected ${test.expectedInvalid}, got ${result.invalid_entries.length}`);
    if (!duplicatesMatch) console.log(`   ❌ Duplicates: Expected ${test.expectedDuplicates}, got ${result.duplicate_edges.length}`);
  }
});

console.log('='.repeat(80));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests\n`);

if (failed === 0) {
  console.log('✨ All tests passed! Ready for deployment.\n');
} else {
  console.log(`⚠️  ${failed} test(s) failed. Please review the logic.\n`);
}

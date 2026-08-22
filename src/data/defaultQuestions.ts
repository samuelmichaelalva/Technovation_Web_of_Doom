import type { Question } from '../types/game';

export const DEFAULT_QUESTIONS: Question[] = [
  // ARRAYS
  {
    id: 'arr-01',
    topic: 'Arrays',
    type: 'mcq',
    difficulty: 'easy',
    question: 'What is the time complexity of accessing an element at a specific index in a dynamic array (like JavaScript Array or C++ std::vector)?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
    correctAnswer: 'O(1)',
    explanation: 'Array elements are stored contiguously in memory, so index access calculates the exact memory offset instantly in constant O(1) time.',
    hint: 'Think about memory offset arithmetic: Base_Address + Index * Element_Size.',
    points: 100
  },
  {
    id: 'arr-02',
    topic: 'Arrays',
    type: 'output',
    difficulty: 'medium',
    question: 'Predict the output of the following array transformation code snippet:',
    codeSnippet: `const arr = [1, 2, 3, 4, 5];
const result = arr.filter(x => x % 2 === 0).map(x => x * 10);
console.log(result.join(', '));`,
    options: ['20, 40', '10, 30, 50', '2, 4', '20, 30, 40'],
    correctAnswer: '20, 40',
    explanation: 'Filter keeps even numbers [2, 4], and map multiplies each element by 10 resulting in [20, 40].',
    hint: 'Filter removes odd numbers first, then map transforms remaining items.',
    points: 200
  },
  {
    id: 'arr-03',
    topic: 'Arrays',
    type: 'debugging',
    difficulty: 'hard',
    question: 'Find the bug in this function designed to reverse an array in-place:',
    codeSnippet: `function reverseArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    let temp = arr[i];
    arr[i] = arr[arr.length - 1 - i];
    arr[arr.length - 1 - i] = temp;
  }
  return arr;
}`,
    options: [
      'The loop iterates through the entire array length instead of half (arr.length / 2), swapping elements twice and reverting them back.',
      'The swap variable temp is not assigned correctly.',
      'The index arr.length - 1 - i results in out of bounds error.',
      'The function returns null.'
    ],
    correctAnswer: 'The loop iterates through the entire array length instead of half (arr.length / 2), swapping elements twice and reverting them back.',
    explanation: 'Looping up to length causes elements swapped in the first half to be swapped back to their original positions in the second half.',
    hint: 'Watch what happens to index 0 when i reaches arr.length - 1.',
    points: 300
  },

  // STRINGS
  {
    id: 'str-01',
    topic: 'Strings',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which algorithmic technique is most efficient for finding the longest palindromic substring or matching anagrams in a string?',
    options: ['Sliding Window / Two Pointers', 'Breadth First Search', 'Dijkstra Algorithm', 'Binary Search Tree'],
    correctAnswer: 'Sliding Window / Two Pointers',
    explanation: 'Two pointers expanding from centers or a sliding window hashmap allows tracking character windows efficiently.',
    hint: 'Think about holding left and right boundaries while iterating.',
    points: 100
  },
  {
    id: 'str-02',
    topic: 'Strings',
    type: 'output',
    difficulty: 'medium',
    question: 'What is the output of the following string manipulation in JavaScript?',
    codeSnippet: `const str = "DOOMBOTS";
console.log(str.slice(2, 6));`,
    options: ['OMBO', 'DOOM', 'MBOT', 'OMBOT'],
    correctAnswer: 'OMBO',
    explanation: 'slice(2, 6) starts at index 2 ("O") and extracts up to (excluding) index 6 ("T"), yielding "OMBO".',
    hint: 'Index 2 is the 3rd character. Index 6 is the upper non-inclusive bound.',
    points: 200
  },
  {
    id: 'str-03',
    topic: 'Strings',
    type: 'debugging',
    difficulty: 'hard',
    question: 'Identify why this string compression logic fails for string "aabcccccaaa":',
    codeSnippet: `function compressString(s) {
  let res = "";
  let count = 1;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === s[i + 1]) {
      count++;
    } else {
      res += s[i] + count;
    }
  }
  return res;
}`,
    options: [
      'The counter `count` is not reset to 1 inside the `else` block after appending character & count.',
      'The string concatenation operator `+` causes integer addition.',
      'The loop condition `i < s.length` leads to null pointer exception.',
      'The function fails to compress single character strings.'
    ],
    correctAnswer: 'The counter `count` is not reset to 1 inside the `else` block after appending character & count.',
    explanation: 'Without `count = 1;` in the `else` branch, `count` continues accumulating total matches across different characters.',
    hint: 'Trace what `count` equals when transitioning from "a" to "b".',
    points: 300
  },

  // STACKS & QUEUES
  {
    id: 'sq-01',
    topic: 'Stacks/Queues',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which data structure operates on a Last-In, First-Out (LIFO) principle and is commonly used for function call stacks and undo mechanisms?',
    options: ['Stack', 'Queue', 'Array List', 'Priority Queue'],
    correctAnswer: 'Stack',
    explanation: 'Stacks operate strictly on LIFO (Last-In, First-Out), pushing and popping from the top element.',
    hint: 'Think of a stack of plates: the last plate placed on top is the first one removed.',
    points: 100
  },
  {
    id: 'sq-02',
    topic: 'Stacks/Queues',
    type: 'output',
    difficulty: 'medium',
    question: 'What is the final state of the queue after the following operations?',
    codeSnippet: `const queue = [];
queue.push("A");
queue.push("B");
queue.shift();
queue.push("C");
queue.push("D");
queue.shift();
console.log(queue.join("->"));`,
    options: ['C->D', 'A->B', 'B->C', 'D->C'],
    correctAnswer: 'C->D',
    explanation: 'Push A, Push B => [A,B]. Shift removes A => [B]. Push C, Push D => [B,C,D]. Shift removes B => [C,D].',
    hint: 'shift() removes from the front (FIFO), push() adds to the back.',
    points: 200
  },
  {
    id: 'sq-03',
    topic: 'Stacks/Queues',
    type: 'debugging',
    difficulty: 'hard',
    question: 'What bug causes this Valid Parentheses checker function to crash on closing brackets when the stack is empty?',
    codeSnippet: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
    options: [
      'If stack is empty when encountering a closing bracket, `stack.pop()` returns `undefined`, which does not match `map[char]`, but causes improper logic flow when popping an empty array.',
      'The dictionary map uses keys in reverse order.',
      'The return statement checking `stack.length === 0` always evaluates to false.',
      'The loop `for (let char of s)` misses the last character.'
    ],
    correctAnswer: 'If stack is empty when encountering a closing bracket, `stack.pop()` returns `undefined`, which does not match `map[char]`, but causes improper logic flow when popping an empty array.',
    explanation: 'Popping an empty stack returns undefined. While undefined !== map[char] returns false, missing `stack.length === 0` check before popping allows invalid strings like ")" to evaluate incorrectly without checking stack size.',
    hint: 'Check if stack has items before calling stack.pop() when a closing parenthesis is encountered.',
    points: 300
  },

  // RECURSION
  {
    id: 'rec-01',
    topic: 'Recursion',
    type: 'mcq',
    difficulty: 'easy',
    question: 'What is the mandatory component of any recursive function to prevent an infinite call stack and stack overflow error?',
    options: ['Base Case', 'Loop Counter', 'Global Variable', 'Try-Catch Block'],
    correctAnswer: 'Base Case',
    explanation: 'The base case provides a stopping condition that returns a value without making further recursive calls.',
    hint: 'What stops a function from calling itself forever?',
    points: 100
  },
  {
    id: 'rec-02',
    topic: 'Recursion',
    type: 'output',
    difficulty: 'medium',
    question: 'What is the return value of mystery(4)?',
    codeSnippet: `function mystery(n) {
  if (n <= 1) return 1;
  return n * mystery(n - 1);
}`,
    options: ['24', '12', '10', '120'],
    correctAnswer: '24',
    explanation: 'This computes 4! (factorial): 4 * 3 * 2 * 1 = 24.',
    hint: 'Calculate 4 * mystery(3) => 4 * 3 * mystery(2) => 4 * 3 * 2 * 1.',
    points: 200
  },
  {
    id: 'rec-03',
    topic: 'Recursion',
    type: 'debugging',
    difficulty: 'hard',
    question: 'Why does this naive Fibonacci function experience exponential time complexity O(2^n)?',
    codeSnippet: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`,
    options: [
      'It recalculates identical subproblems repeatedly without memoization / dynamic programming caching.',
      'The base condition `if (n <= 1)` is incorrect for n = 0.',
      'The addition operator `+` causes integer overflow.',
      'The function makes 3 recursive calls per step.'
    ],
    correctAnswer: 'It recalculates identical subproblems repeatedly without memoization / dynamic programming caching.',
    explanation: 'Without caching (memoization), the call tree doubles at each level, recomputing fib(2), fib(3) thousands of times.',
    hint: 'Draw the call tree for fib(5); notice how many times fib(2) is called.',
    points: 300
  },

  // TIME COMPLEXITY
  {
    id: 'tc-01',
    topic: 'Time Complexity',
    type: 'mcq',
    difficulty: 'easy',
    question: 'What is the worst-case time complexity of Binary Search on a sorted array of size N?',
    options: ['O(log N)', 'O(N)', 'O(N log N)', 'O(1)'],
    correctAnswer: 'O(log N)',
    explanation: 'Binary Search halves the search space at each iteration, resulting in logarithmic O(log N) time complexity.',
    hint: 'Each step cuts the array length in half.',
    points: 100
  },
  {
    id: 'tc-02',
    topic: 'Time Complexity',
    type: 'output',
    difficulty: 'medium',
    question: 'Determine the tightest Big-O time complexity of the following nested loop:',
    codeSnippet: `for (let i = 1; i <= n; i *= 2) {
  for (let j = 0; j < n; j++) {
    console.log("DOOM");
  }
}`,
    options: ['O(n log n)', 'O(n^2)', 'O(n)', 'O(log n)'],
    correctAnswer: 'O(n log n)',
    explanation: 'The outer loop multiplies i by 2, running log2(n) times. The inner loop runs n times. Combined time complexity is O(n log n).',
    hint: 'Outer loop takes log(n) steps because of i *= 2. Inner loop takes n steps.',
    points: 200
  },
  {
    id: 'tc-03',
    topic: 'Time Complexity',
    type: 'debugging',
    difficulty: 'hard',
    question: 'Analyze why checking if two arrays contain common elements using `.includes()` inside a `.filter()` yields quadratic O(N * M) complexity:',
    codeSnippet: `function getCommon(arr1, arr2) {
  return arr1.filter(item => arr2.includes(item));
}`,
    options: [
      '`arr2.includes(item)` performs an O(M) linear search for every element in arr1 (O(N)), resulting in O(N * M) instead of O(N + M) with a Set.',
      'The `.filter()` method creates a deep copy of memory leading to O(N^2) space.',
      'Array comparison in JavaScript triggers O(N!) string conversion.',
      '`.includes()` sorts both arrays before searching.'
    ],
    correctAnswer: '`arr2.includes(item)` performs an O(M) linear search for every element in arr1 (O(N)), resulting in O(N * M) instead of O(N + M) with a Set.',
    explanation: 'Linear search `includes` takes O(M). Doing it inside a filter of size N yields N * M. Converting arr2 to a `Set` allows O(1) lookups, optimizing to O(N + M).',
    hint: 'How fast is includes() on a standard array vs a HashSet?',
    points: 300
  },

  // BASIC TREES
  {
    id: 'tree-01',
    topic: 'Basic Trees',
    type: 'mcq',
    difficulty: 'easy',
    question: 'In a Binary Search Tree (BST), which depth-first traversal strategy visits nodes in strictly ascending sorted order?',
    options: ['In-Order Traversal (Left, Root, Right)', 'Pre-Order Traversal (Root, Left, Right)', 'Post-Order Traversal (Left, Right, Root)', 'Level-Order Traversal (BFS)'],
    correctAnswer: 'In-Order Traversal (Left, Root, Right)',
    explanation: 'In-Order traversal processes Left child, then Node, then Right child, yielding keys in sorted ascending order.',
    hint: 'In-order = Left -> Root -> Right.',
    points: 100
  },
  {
    id: 'tree-02',
    topic: 'Basic Trees',
    type: 'output',
    difficulty: 'medium',
    question: 'Given a Binary Tree node count N, what is the maximum height of a skewed Binary Search Tree?',
    codeSnippet: `// Example skewed tree: 1 -> 2 -> 3 -> 4
// Depth = ?`,
    options: ['N - 1', 'log2(N)', 'sqrt(N)', '2 * N'],
    correctAnswer: 'N - 1',
    explanation: 'In a completely degenerate/skewed tree (resembling a linked list), the height is N - 1 (or N levels).',
    hint: 'A linear tree where every node only has a right child.',
    points: 200
  },
  {
    id: 'tree-03',
    topic: 'Basic Trees',
    type: 'debugging',
    difficulty: 'hard',
    question: 'Identify the bug in this maximum depth calculation of a Binary Tree:',
    codeSnippet: `function maxDepth(root) {
  if (root === null) return 0;
  let left = maxDepth(root.left);
  let right = maxDepth(root.right);
  return left + right + 1; // Bug here
}`,
    options: [
      'Line `return left + right + 1;` sums depths of both subtrees instead of taking `Math.max(left, right) + 1`.',
      'The base case `if (root === null)` should return -1.',
      'Variable `left` should be assigned synchronously using a loop.',
      'Tree recursion cannot process leaf nodes.'
    ],
    correctAnswer: 'Line `return left + right + 1;` sums depths of both subtrees instead of taking `Math.max(left, right) + 1`.',
    explanation: 'Tree depth is determined by the longest path from root to leaf, requiring `Math.max(left, right) + 1`. Summing left + right counts total node path lengths.',
    hint: 'Does depth mean adding both branches together or picking the deeper branch?',
    points: 300
  }
];

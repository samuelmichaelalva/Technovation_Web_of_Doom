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
  },

  // ──── ADDITIONAL ARRAYS ────
  {
    id: 'arr-04',
    topic: 'Arrays',
    type: 'mcq',
    difficulty: 'medium',
    question: 'Which algorithmic technique efficiently finds a pair of elements in a sorted array that sum to a given target value?',
    options: ['Two Pointer Technique', 'Bubble Sort', 'DFS (Depth-First Search)', 'Dijkstra\'s Algorithm'],
    correctAnswer: 'Two Pointer Technique',
    explanation: 'With one pointer at the start and one at the end, we can adjust them inward based on whether the current sum is too large or too small, achieving O(n) time.',
    hint: 'Think about placing one pointer at each end of the sorted array and moving them toward each other.',
    points: 200
  },
  {
    id: 'arr-05',
    topic: 'Arrays',
    type: 'output',
    difficulty: 'hard',
    question: 'What is the output of this code?',
    codeSnippet: `const arr = [3, 1, 4, 1, 5, 9];
const result = arr.reduce((acc, val) => acc > val ? acc : val, -Infinity);
console.log(result);`,
    options: ['9', '3', '23', '-Infinity'],
    correctAnswer: '9',
    explanation: 'The reduce function iterates through the array, keeping the maximum value seen so far. Starting from -Infinity, it finds 9 as the largest element.',
    hint: 'reduce() here acts as a manual Math.max() by comparing the accumulator to each value.',
    points: 300
  },

  // ──── ADDITIONAL STRINGS ────
  {
    id: 'str-04',
    topic: 'Strings',
    type: 'mcq',
    difficulty: 'medium',
    question: 'What is the time complexity of checking whether a string is a palindrome by comparing characters from both ends?',
    options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(1)'],
    correctAnswer: 'O(n)',
    explanation: 'Each character is visited at most once using two pointers (one from start, one from end), making it a single linear pass O(n).',
    hint: 'How many characters does each pointer need to visit before they meet in the middle?',
    points: 200
  },

  // ──── ADDITIONAL STACKS/QUEUES ────
  {
    id: 'sq-04',
    topic: 'Stacks/Queues',
    type: 'output',
    difficulty: 'medium',
    question: 'What does this stack-based expression evaluator output?',
    codeSnippet: `const stack = [];
const tokens = "3 4 + 2 *".split(" ");
for (const t of tokens) {
  if ("+-*".includes(t)) {
    const b = stack.pop(), a = stack.pop();
    if (t === "+") stack.push(a + b);
    else if (t === "*") stack.push(a * b);
  } else { stack.push(Number(t)); }
}
console.log(stack[0]);`,
    options: ['14', '10', '9', '24'],
    correctAnswer: '14',
    explanation: 'This is Reverse Polish Notation. Push 3, push 4. Pop 3+4=7, push 7. Push 2. Pop 7*2=14, push 14. Result: 14.',
    hint: 'This is RPN (postfix notation). Operators apply to the two most recent numbers on the stack.',
    points: 200
  },

  // ──── ADDITIONAL RECURSION ────
  {
    id: 'rec-04',
    topic: 'Recursion',
    type: 'output',
    difficulty: 'hard',
    question: 'What does countdown(5) print?',
    codeSnippet: `function countdown(n) {
  if (n <= 0) { console.log("GO!"); return; }
  console.log(n);
  countdown(n - 2);
}
countdown(5);`,
    options: ['5, 3, 1, GO!', '5, 4, 3, 2, 1, GO!', '5, 3, GO!', '5, 3, 1'],
    correctAnswer: '5, 3, 1, GO!',
    explanation: 'countdown(5) prints 5, calls countdown(3) which prints 3, calls countdown(1) which prints 1, calls countdown(-1) which prints "GO!" and returns.',
    hint: 'Trace each call: n decreases by 2 each time until n <= 0.',
    points: 300
  },

  // ──── ADDITIONAL TIME COMPLEXITY ────
  {
    id: 'tc-04',
    topic: 'Time Complexity',
    type: 'mcq',
    difficulty: 'hard',
    question: 'What is the time complexity of Merge Sort in the worst case?',
    options: ['O(n log n)', 'O(n^2)', 'O(n)', 'O(log n)'],
    correctAnswer: 'O(n log n)',
    explanation: 'Merge Sort divides the array in half each time (log n levels), and merges n elements at each level, giving O(n log n) in all cases.',
    hint: 'How many levels of recursion are there, and how much work is done at each level?',
    points: 300
  },

  // ──── TREES & GRAPHS (NEW CATEGORY) ────
  {
    id: 'tg-01',
    topic: 'Trees & Graphs',
    type: 'mcq',
    difficulty: 'easy',
    question: 'Which traversal algorithm uses a queue data structure to visit nodes level by level in a tree or graph?',
    options: ['Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Pre-Order Traversal', 'Post-Order Traversal'],
    correctAnswer: 'Breadth-First Search (BFS)',
    explanation: 'BFS uses a FIFO queue to explore all neighbors at the current depth before moving to the next level.',
    hint: 'Which search strategy explores "wide" before "deep"?',
    points: 100
  },
  {
    id: 'tg-02',
    topic: 'Trees & Graphs',
    type: 'output',
    difficulty: 'medium',
    question: 'Given an adjacency list graph, what order does BFS visit nodes starting from node "A"?',
    codeSnippet: `const graph = {
  A: ["B", "C"],
  B: ["D"],
  C: ["E"],
  D: [], E: []
};
// BFS from "A"`,
    options: ['A, B, C, D, E', 'A, B, D, C, E', 'A, C, E, B, D', 'D, B, A, C, E'],
    correctAnswer: 'A, B, C, D, E',
    explanation: 'BFS visits A first, then its neighbors B and C (in order), then B\'s neighbor D, then C\'s neighbor E.',
    hint: 'BFS processes all children of A before moving to grandchildren.',
    points: 200
  },
  {
    id: 'tg-03',
    topic: 'Trees & Graphs',
    type: 'debugging',
    difficulty: 'hard',
    question: 'Why does this DFS cycle detection fail on undirected graphs?',
    codeSnippet: `function hasCycle(graph, node, visited) {
  visited.add(node);
  for (const neighbor of graph[node]) {
    if (visited.has(neighbor)) return true;
    if (hasCycle(graph, neighbor, visited)) return true;
  }
  return false;
}`,
    options: [
      'It does not track the parent node, so it falsely detects the edge back to the parent as a cycle in undirected graphs.',
      'The visited set should be an array, not a Set.',
      'The recursive call should pass a copy of visited.',
      'DFS cannot detect cycles in any graph.'
    ],
    correctAnswer: 'It does not track the parent node, so it falsely detects the edge back to the parent as a cycle in undirected graphs.',
    explanation: 'In an undirected graph, every edge creates a back-reference. Without tracking which node we came from (parent), the algorithm mistakenly considers the parent as a cycle.',
    hint: 'In undirected graphs, A→B and B→A are the same edge. How do you distinguish a real cycle from just going back?',
    points: 300
  },
  {
    id: 'tg-04',
    topic: 'Trees & Graphs',
    type: 'mcq',
    difficulty: 'medium',
    question: 'What is the maximum number of edges in a simple undirected graph with N vertices (no self-loops, no multi-edges)?',
    options: ['N*(N-1)/2', 'N*N', 'N-1', '2*N'],
    correctAnswer: 'N*(N-1)/2',
    explanation: 'Each vertex can connect to N-1 others, but each edge is counted twice, giving N*(N-1)/2 unique edges.',
    hint: 'Think of a complete graph where every vertex is connected to every other vertex.',
    points: 200
  },
  {
    id: 'tg-05',
    topic: 'Trees & Graphs',
    type: 'output',
    difficulty: 'easy',
    question: 'In a tree with 7 nodes, how many edges are there?',
    codeSnippet: `// A tree is a connected acyclic graph.
// Nodes: 7
// Edges: ?`,
    options: ['6', '7', '8', '14'],
    correctAnswer: '6',
    explanation: 'A tree with N nodes always has exactly N-1 edges. With 7 nodes, there are 6 edges.',
    hint: 'The fundamental property of a tree: edges = nodes - 1.',
    points: 100
  },

  // ──── DP & GREEDY (NEW CATEGORY) ────
  {
    id: 'dp-01',
    topic: 'DP & Greedy',
    type: 'mcq',
    difficulty: 'easy',
    question: 'What technique stores the results of expensive function calls and returns the cached result when the same inputs occur again?',
    options: ['Memoization', 'Recursion', 'Binary Search', 'Hashing'],
    correctAnswer: 'Memoization',
    explanation: 'Memoization is a top-down dynamic programming approach that caches results of subproblems to avoid redundant computations.',
    hint: 'It\'s like keeping a "memo" of previously computed answers.',
    points: 100
  },
  {
    id: 'dp-02',
    topic: 'DP & Greedy',
    type: 'output',
    difficulty: 'medium',
    question: 'What does this function return for climbStairs(4)?',
    codeSnippet: `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}`,
    options: ['5', '4', '8', '3'],
    correctAnswer: '5',
    explanation: 'This is the Fibonacci climbing stairs problem. For n=4: ways = 1,2,3,5. You can climb 1 or 2 steps at a time, giving 5 distinct ways.',
    hint: 'Trace the loop: i=3 → a=2,b=3; i=4 → a=3,b=5.',
    points: 200
  },
  {
    id: 'dp-03',
    topic: 'DP & Greedy',
    type: 'debugging',
    difficulty: 'hard',
    question: 'Why does this greedy coin change algorithm fail to find the minimum number of coins for amount=6 with coins=[1, 3, 4]?',
    codeSnippet: `function minCoins(coins, amount) {
  coins.sort((a, b) => b - a); // Sort descending
  let count = 0;
  for (const coin of coins) {
    count += Math.floor(amount / coin);
    amount %= coin;
  }
  return count;
}
// minCoins([1, 3, 4], 6) returns 3 (4+1+1)
// but optimal is 2 (3+3)`,
    options: [
      'The greedy approach always picks the largest coin first, but this doesn\'t guarantee the global minimum. Dynamic Programming is needed for optimal coin change.',
      'The sort function is incorrect and should sort ascending.',
      'Math.floor causes rounding errors with large amounts.',
      'The modulo operator % does not work with coin values.'
    ],
    correctAnswer: 'The greedy approach always picks the largest coin first, but this doesn\'t guarantee the global minimum. Dynamic Programming is needed for optimal coin change.',
    explanation: 'Greedy picks coin 4 first (6/4=1, remainder 2), then coin 1 twice. Total: 3 coins. But using two 3-coins gives 2 coins. Greedy fails because locally optimal choices don\'t always lead to globally optimal solutions.',
    hint: 'Does always picking the biggest coin guarantee the fewest total coins?',
    points: 300
  },
  {
    id: 'dp-04',
    topic: 'DP & Greedy',
    type: 'mcq',
    difficulty: 'medium',
    question: 'In the classic 0/1 Knapsack problem, what makes it different from the fractional (greedy) knapsack?',
    options: [
      'Items cannot be divided — you must take the whole item or leave it, requiring Dynamic Programming.',
      'Items are sorted by weight before selection.',
      'The knapsack has unlimited capacity.',
      'Items have no weight, only value.'
    ],
    correctAnswer: 'Items cannot be divided — you must take the whole item or leave it, requiring Dynamic Programming.',
    explanation: 'In 0/1 Knapsack, each item is either fully included or excluded. This discrete choice prevents the greedy fractional approach and requires DP to explore all subsets optimally.',
    hint: 'Can you take half of an item in 0/1 Knapsack?',
    points: 200
  }
];

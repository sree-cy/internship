const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const DSAQuestion = require("./models/DSAQuestion");

const questions = [
  // =========================================================================
  // EASY (6 QUESTIONS)
  // =========================================================================
  {
    title: "Two Sum",
    difficulty: "easy",
    topic: "Hash Tables",
    description:
      "Given an array of integers `nums` and an integer `target`, return the 0-based indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. Print the two indices separated by a space in ascending order.",
    examples: [
      {
        input: "4 9\n2 7 11 15",
        output: "0 1",
        explanation: "Because nums[0] + nums[1] == 2 + 7 == 9, we return 0 1.",
      },
      {
        input: "3 6\n3 2 4",
        output: "1 2",
        explanation: "nums[1] + nums[2] == 2 + 4 == 6, we return 1 2.",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    starterCode: {
      python: `import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    target = int(input_data[1])
    nums = [int(x) for x in input_data[2:2+n]]
    
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            print(f"{seen[diff]} {i}")
            return
        seen[num] = i

if __name__ == "__main__":
    solve()
`,
      c: `#include <stdio.h>

int main() {
    int n, target;
    if (scanf("%d %d", &n, &target) != 2) return 0;
    int nums[10005];
    for (int i = 0; i < n; i++) {
        scanf("%d", &nums[i]);
    }
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                printf("%d %d\\n", i, j);
                return 0;
            }
        }
    }
    return 0;
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, target;
    if (!(cin >> n >> target)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    
    unordered_map<int, int> mp;
    for (int i = 0; i < n; i++) {
        int complement = target - nums[i];
        if (mp.count(complement)) {
            cout << mp[complement] << " " << i << "\\n";
            return 0;
        }
        mp[nums[i]] = i;
    }
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int target = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                System.out.println(map.get(complement) + " " + i);
                return;
            }
            map.put(nums[i], i);
        }
    }
}
`,
    },
    marks: 30,
    testCases: [
      {
        input: "4 9\n2 7 11 15",
        rawInput: "4 9\n2 7 11 15",
        expectedOutput: "0 1",
        isHidden: false,
      },
      {
        input: "3 6\n3 2 4",
        rawInput: "3 6\n3 2 4",
        expectedOutput: "1 2",
        isHidden: false,
      },
      {
        input: "2 6\n3 3",
        rawInput: "2 6\n3 3",
        expectedOutput: "0 1",
        isHidden: true,
      },
      {
        input: "5 -8\n-1 -2 -3 -4 -5",
        rawInput: "5 -8\n-1 -2 -3 -4 -5",
        expectedOutput: "2 4",
        isHidden: true,
      },
    ],
    hints: [
      "Consider using a Hash Map to store previously seen numbers with their indices.",
      "Check if (target - current_number) already exists in your map.",
    ],
  },
  {
    title: "Reverse String",
    difficulty: "easy",
    topic: "Strings",
    description:
      "Write a program that takes a string `s` as input and prints the reversed string.\n\nYou should do this efficiently using standard two-pointer or reverse logic.",
    examples: [
      {
        input: "hello",
        output: "olleh",
        explanation: "'hello' reversed character-by-character gives 'olleh'.",
      },
      {
        input: "PrepGo",
        output: "oGperP",
        explanation: "'PrepGo' reversed is 'oGperP'.",
      },
    ],
    constraints: ["1 <= s.length <= 10^5", "s consists of printable characters."],
    starterCode: {
      python: `import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
    print(s[::-1])

if __name__ == "__main__":
    solve()
`,
      c: `#include <stdio.h>
#include <string.h>

int main() {
    char s[100005];
    if (scanf("%s", s) != 1) return 0;
    int len = strlen(s);
    for (int i = len - 1; i >= 0; i--) {
        putchar(s[i]);
    }
    putchar('\\n');
    return 0;
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    if (cin >> s) {
        reverse(s.begin(), s.end());
        cout << s << "\\n";
    }
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNext()) {
            String s = sc.next();
            StringBuilder sb = new StringBuilder(s);
            System.out.println(sb.reverse().toString());
        }
    }
}
`,
    },
    marks: 30,
    testCases: [
      {
        input: "hello",
        rawInput: "hello",
        expectedOutput: "olleh",
        isHidden: false,
      },
      {
        input: "Hannah",
        rawInput: "Hannah",
        expectedOutput: "hannaH",
        isHidden: false,
      },
      {
        input: "PrepGo",
        rawInput: "PrepGo",
        expectedOutput: "oGperP",
        isHidden: true,
      },
      {
        input: "algorithm",
        rawInput: "algorithm",
        expectedOutput: "mhtirogla",
        isHidden: true,
      },
    ],
    hints: [
      "Use two pointers, one at the start and one at the end.",
      "Swap characters and increment/decrement pointers until they meet.",
    ],
  },
  {
    title: "Contains Duplicate",
    difficulty: "easy",
    topic: "Arrays",
    description:
      "Given an array of integers `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    examples: [
      {
        input: "4\n1 2 3 1",
        output: "true",
        explanation: "1 appears twice at index 0 and 3.",
      },
      {
        input: "4\n1 2 3 4",
        output: "false",
        explanation: "All elements are distinct.",
      },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:1+n]]
    if len(set(nums)) < len(nums):
        print("true")
    else:
        print("false")

if __name__ == "__main__":
    solve()
`,
      c: `#include <stdio.h>
#include <stdlib.h>

int cmp(const void *a, const void *b) {
    return (*(int*)a - *(int*)b);
}

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int *arr = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    qsort(arr, n, sizeof(int), cmp);
    for (int i = 0; i < n - 1; i++) {
        if (arr[i] == arr[i+1]) {
            printf("true\\n");
            free(arr);
            return 0;
        }
    }
    printf("false\\n");
    free(arr);
    return 0;
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    unordered_set<int> seen;
    bool dup = false;
    for (int i = 0; i < n; i++) {
        int val;
        cin >> val;
        if (seen.count(val)) dup = true;
        seen.insert(val);
    }
    cout << (dup ? "true" : "false") << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        Set<Integer> set = new HashSet<>();
        boolean dup = false;
        for (int i = 0; i < n; i++) {
            int val = sc.nextInt();
            if (!set.add(val)) dup = true;
        }
        System.out.println(dup ? "true" : "false");
    }
}
`,
    },
    marks: 30,
    testCases: [
      {
        input: "4\n1 2 3 1",
        rawInput: "4\n1 2 3 1",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "4\n1 2 3 4",
        rawInput: "4\n1 2 3 4",
        expectedOutput: "false",
        isHidden: false,
      },
      {
        input: "10\n1 1 1 3 3 4 3 2 4 2",
        rawInput: "10\n1 1 1 3 3 4 3 2 4 2",
        expectedOutput: "true",
        isHidden: true,
      },
    ],
    hints: [
      "Use a hash set to detect duplicate values in O(N) time.",
      "Alternatively, sorting the array takes O(N log N) time and adjacent duplicates can be checked.",
    ],
  },
  {
    title: "Binary Search",
    difficulty: "easy",
    topic: "Searching",
    description:
      "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, return its 0-based index. Otherwise, return `-1`.\n\nYou must write an algorithm with O(log n) runtime complexity.",
    examples: [
      {
        input: "6 9\n-1 0 3 5 9 12",
        output: "4",
        explanation: "9 exists in nums and its index is 4.",
      },
      {
        input: "6 2\n-1 0 3 5 9 12",
        output: "-1",
        explanation: "2 does not exist in nums so return -1.",
      },
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order.",
    ],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    target = int(tokens[1])
    nums = [int(x) for x in tokens[2:2+n]]
    
    left, right = 0, n - 1
    ans = -1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            ans = mid
            break
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    print(ans)

if __name__ == "__main__":
    solve()
`,
      c: `#include <stdio.h>

int main() {
    int n, target;
    if (scanf("%d %d", &n, &target) != 2) return 0;
    int nums[100005];
    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);
    int left = 0, right = n - 1, ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            ans = mid;
            break;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    printf("%d\\n", ans);
    return 0;
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, target;
    if (!(cin >> n >> target)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int left = 0, right = n - 1, ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            ans = mid;
            break;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    cout << ans << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int target = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int left = 0, right = n - 1, ans = -1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) {
                ans = mid;
                break;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        System.out.println(ans);
    }
}
`,
    },
    marks: 30,
    testCases: [
      {
        input: "6 9\n-1 0 3 5 9 12",
        rawInput: "6 9\n-1 0 3 5 9 12",
        expectedOutput: "4",
        isHidden: false,
      },
      {
        input: "6 2\n-1 0 3 5 9 12",
        rawInput: "6 2\n-1 0 3 5 9 12",
        expectedOutput: "-1",
        isHidden: false,
      },
      {
        input: "1 5\n5",
        rawInput: "1 5\n5",
        expectedOutput: "0",
        isHidden: true,
      },
    ],
    hints: [
      "Maintain search interval [left, right].",
      "Calculate mid = left + (right - left) // 2 to avoid integer overflow.",
    ],
  },
  {
    title: "Valid Palindrome",
    difficulty: "easy",
    topic: "Strings",
    description:
      "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
    examples: [
      {
        input: "racecar",
        output: "true",
        explanation: "'racecar' reads the same forwards and backwards.",
      },
      {
        input: "hello",
        output: "false",
        explanation: "'hello' is not a palindrome.",
      },
    ],
    constraints: ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters."],
    starterCode: {
      python: `import sys

def solve():
    s = sys.stdin.read().strip()
    filtered = [ch.lower() for ch in s if ch.isalnum()]
    if filtered == filtered[::-1]:
        print("true")
    else:
        print("false")

if __name__ == "__main__":
    solve()
`,
      c: `#include <stdio.h>
#include <ctype.h>
#include <string.h>

int main() {
    char s[200005];
    if (scanf("%s", s) != 1) return 0;
    int l = 0, r = strlen(s) - 1;
    while (l < r) {
        while (l < r && !isalnum(s[l])) l++;
        while (l < r && !isalnum(s[r])) r--;
        if (tolower(s[l]) != tolower(s[r])) {
            printf("false\\n");
            return 0;
        }
        l++;
        r--;
    }
    printf("true\\n");
    return 0;
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    if (cin >> s) {
        string filtered = "";
        for (char c : s) {
            if (isalnum(c)) filtered += tolower(c);
        }
        string rev = filtered;
        reverse(rev.begin(), rev.end());
        cout << (filtered == rev ? "true" : "false") << "\\n";
    }
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNext()) {
            String s = sc.next();
            StringBuilder sb = new StringBuilder();
            for (char c : s.toCharArray()) {
                if (Character.isLetterOrDigit(c)) {
                    sb.append(Character.toLowerCase(c));
                }
            }
            String filtered = sb.toString();
            String rev = sb.reverse().toString();
            System.out.println(filtered.equals(rev) ? "true" : "false");
        }
    }
}
`,
    },
    marks: 30,
    testCases: [
      {
        input: "racecar",
        rawInput: "racecar",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "hello",
        rawInput: "hello",
        expectedOutput: "false",
        isHidden: false,
      },
      {
        input: "A1b2b1a",
        rawInput: "A1b2b1a",
        expectedOutput: "true",
        isHidden: true,
      },
    ],
    hints: [
      "Filter out non-alphanumeric characters and lowercase everything.",
      "Compare the string with its reverse, or use two pointers from both ends.",
    ],
  },
  {
    title: "Sort Array Elements",
    difficulty: "easy",
    topic: "Sorting",
    description:
      "Given an array of `n` integers, sort the array in non-decreasing order and print the sorted integers separated by a single space.",
    examples: [
      {
        input: "5\n5 2 9 1 5",
        output: "1 2 5 5 9",
        explanation: "Sorted array in ascending order is 1 2 5 5 9.",
      },
      {
        input: "4\n4 3 2 1",
        output: "1 2 3 4",
        explanation: "Sorted array is 1 2 3 4.",
      },
    ],
    constraints: ["1 <= n <= 5 * 10^4", "-10^5 <= nums[i] <= 10^5"],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:1+n]]
    nums.sort()
    print(" ".join(map(str, nums)))

if __name__ == "__main__":
    solve()
`,
      c: `#include <stdio.h>
#include <stdlib.h>

int cmp(const void *a, const void *b) {
    return (*(int*)a - *(int*)b);
}

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int arr[50005];
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    qsort(arr, n, sizeof(int), cmp);
    for (int i = 0; i < n; i++) {
        printf("%d%c", arr[i], (i == n - 1) ? '\\n' : ' ');
    }
    return 0;
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    sort(nums.begin(), nums.end());
    for (int i = 0; i < n; i++) {
        cout << nums[i] << (i == n - 1 ? "" : " ");
    }
    cout << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        Arrays.sort(arr);
        for (int i = 0; i < n; i++) {
            System.out.print(arr[i] + (i == n - 1 ? "\\n" : " "));
        }
    }
}
`,
    },
    marks: 30,
    testCases: [
      {
        input: "5\n5 2 9 1 5",
        rawInput: "5\n5 2 9 1 5",
        expectedOutput: "1 2 5 5 9",
        isHidden: false,
      },
      {
        input: "4\n4 3 2 1",
        rawInput: "4\n4 3 2 1",
        expectedOutput: "1 2 3 4",
        isHidden: false,
      },
      {
        input: "3\n0 -5 10",
        rawInput: "3\n0 -5 10",
        expectedOutput: "-5 0 10",
        isHidden: true,
      },
    ],
    hints: [
      "Use built-in quicksort or mergesort algorithms which execute in O(N log N) time.",
    ],
  },

  // =========================================================================
  // MEDIUM (6 QUESTIONS)
  // =========================================================================
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    topic: "Strings",
    description:
      "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples: [
      {
        input: "abcabcbb",
        output: "3",
        explanation: "The answer is 'abc', with the length of 3.",
      },
      {
        input: "bbbbb",
        output: "1",
        explanation: "The answer is 'b', with the length of 1.",
      },
      {
        input: "pwwkew",
        output: "3",
        explanation: "The answer is 'wke', with the length of 3.",
      },
    ],
    constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
    starterCode: {
      python: `import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        print(0)
        return
    char_map = {}
    max_len = 0
    left = 0
    for right, ch in enumerate(s):
        if ch in char_map and char_map[ch] >= left:
            left = char_map[ch] + 1
        char_map[ch] = right
        max_len = max(max_len, right - left + 1)
    print(max_len)

if __name__ == "__main__":
    solve()
`,
      c: `#include <stdio.h>
#include <string.h>

int main() {
    char s[50005];
    if (scanf("%s", s) != 1) {
        printf("0\\n");
        return 0;
    }
    int last[256];
    for (int i = 0; i < 256; i++) last[i] = -1;
    int max_len = 0, left = 0, len = strlen(s);
    for (int right = 0; right < len; right++) {
        unsigned char c = (unsigned char)s[right];
        if (last[c] >= left) left = last[c] + 1;
        last[c] = right;
        int cur = right - left + 1;
        if (cur > max_len) max_len = cur;
    }
    printf("%d\\n", max_len);
    return 0;
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    if (!(cin >> s)) {
        cout << 0 << "\\n";
        return 0;
    }
    vector<int> last(256, -1);
    int max_len = 0, left = 0;
    for (int right = 0; right < s.length(); right++) {
        unsigned char c = s[right];
        if (last[c] >= left) left = last[c] + 1;
        last[c] = right;
        max_len = max(max_len, right - left + 1);
    }
    cout << max_len << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) {
            System.out.println(0);
            return;
        }
        String s = sc.next();
        Map<Character, Integer> map = new HashMap<>();
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c) && map.get(c) >= left) {
                left = map.get(c) + 1;
            }
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        System.out.println(maxLen);
    }
}
`,
    },
    marks: 30,
    testCases: [
      {
        input: "abcabcbb",
        rawInput: "abcabcbb",
        expectedOutput: "3",
        isHidden: false,
      },
      {
        input: "bbbbb",
        rawInput: "bbbbb",
        expectedOutput: "1",
        isHidden: false,
      },
      {
        input: "pwwkew",
        rawInput: "pwwkew",
        expectedOutput: "3",
        isHidden: true,
      },
      {
        input: "au",
        rawInput: "au",
        expectedOutput: "2",
        isHidden: true,
      },
    ],
    hints: [
      "Use the sliding window technique with two pointers [left, right].",
      "Store the last seen index of each character to jump the left pointer forward in O(1).",
    ],
  },
  {
    title: "Merge Two Sorted Arrays",
    difficulty: "medium",
    topic: "Sorting",
    description:
      "You are given two integer arrays `nums1` and `nums2`, each sorted in non-decreasing order. Merge `nums1` and `nums2` into a single sorted array and print the elements separated by spaces.",
    examples: [
      {
        input: "3 3\n1 2 3\n2 5 6",
        output: "1 2 2 3 5 6",
        explanation: "Merged array is 1 2 2 3 5 6.",
      },
      {
        input: "1 1\n1\n2",
        output: "1 2",
        explanation: "Merged array is 1 2.",
      },
    ],
    constraints: ["1 <= n, m <= 5 * 10^4", "-10^9 <= nums[i] <= 10^9"],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    m = int(tokens[1])
    nums1 = [int(x) for x in tokens[2:2+n]]
    nums2 = [int(x) for x in tokens[2+n:2+n+m]]
    
    i, j = 0, 0
    res = []
    while i < n and j < m:
        if nums1[i] <= nums2[j]:
            res.append(nums1[i])
            i += 1
        else:
            res.append(nums2[j])
            j += 1
    res.extend(nums1[i:])
    res.extend(nums2[j:])
    print(" ".join(map(str, res)))

if __name__ == "__main__":
    solve()
`,
      c: `#include <stdio.h>

int main() {
    int n, m;
    if (scanf("%d %d", &n, &m) != 2) return 0;
    int a[50005], b[50005];
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    for (int i = 0; i < m; i++) scanf("%d", &b[i]);
    int i = 0, j = 0;
    int first = 1;
    while (i < n && j < m) {
        if (a[i] <= b[j]) {
            printf("%s%d", first ? "" : " ", a[i++]);
        } else {
            printf("%s%d", first ? "" : " ", b[j++]);
        }
        first = 0;
    }
    while (i < n) printf(" %d", a[i++]);
    while (j < m) printf(" %d", b[j++]);
    printf("\\n");
    return 0;
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<int> a(n), b(m);
    for (int i = 0; i < n; i++) cin >> a[i];
    for (int i = 0; i < m; i++) cin >> b[i];
    vector<int> res;
    int i = 0, j = 0;
    while (i < n && j < m) {
        if (a[i] <= b[j]) res.push_back(a[i++]);
        else res.push_back(b[j++]);
    }
    while (i < n) res.push_back(a[i++]);
    while (j < m) res.push_back(b[j++]);
    for (int k = 0; k < res.size(); k++) {
        cout << res[k] << (k + 1 == res.size() ? "" : " ");
    }
    cout << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int m = sc.nextInt();
        int[] a = new int[n];
        int[] b = new int[m];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        for (int i = 0; i < m; i++) b[i] = sc.nextInt();
        int i = 0, j = 0;
        List<Integer> list = new ArrayList<>();
        while (i < n && j < m) {
            if (a[i] <= b[j]) list.add(a[i++]);
            else list.add(b[j++]);
        }
        while (i < n) list.add(a[i++]);
        while (j < m) list.add(b[j++]);
        for (int k = 0; k < list.size(); k++) {
            System.out.print(list.get(k) + (k == list.size() - 1 ? "\\n" : " "));
        }
    }
}
`,
    },
    marks: 30,
    testCases: [
      {
        input: "3 3\n1 2 3\n2 5 6",
        rawInput: "3 3\n1 2 3\n2 5 6",
        expectedOutput: "1 2 2 3 5 6",
        isHidden: false,
      },
      {
        input: "1 1\n1\n2",
        rawInput: "1 1\n1\n2",
        expectedOutput: "1 2",
        isHidden: false,
      },
      {
        input: "4 2\n0 4 8 12\n3 9",
        rawInput: "4 2\n0 4 8 12\n3 9",
        expectedOutput: "0 3 4 8 9 12",
        isHidden: true,
      },
    ],
    hints: [
      "Use two pointers starting at the beginning of each array.",
      "Compare the current elements and advance the pointer with the smaller value.",
    ],
  },
  {
    title: "Maximum Subarray Sum",
    difficulty: "medium",
    topic: "Dynamic Programming",
    description:
      "Given an integer array `nums`, find the subarray with the largest sum, and return its sum (Kadane's Algorithm).",
    examples: [
      {
        input: "9\n-2 1 -3 4 -1 2 1 -5 4",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
      },
      {
        input: "1\n1",
        output: "1",
        explanation: "The subarray [1] has the largest sum 1.",
      },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:1+n]]
    
    max_sum = nums[0]
    cur_sum = nums[0]
    for x in nums[1:]:
        cur_sum = max(x, cur_sum + x)
        max_sum = max(max_sum, cur_sum)
    print(max_sum)

if __name__ == "__main__":
    solve()
`,
      c: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    long long x;
    scanf("%lld", &x);
    long long cur = x, best = x;
    for (int i = 1; i < n; i++) {
        scanf("%lld", &x);
        cur = (x > cur + x) ? x : cur + x;
        if (cur > best) best = cur;
    }
    printf("%lld\\n", best);
    return 0;
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    long long x;
    cin >> x;
    long long cur = x, best = x;
    for (int i = 1; i < n; i++) {
        cin >> x;
        cur = max(x, cur + x);
        best = max(best, cur);
    }
    cout << best << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        long x = sc.nextLong();
        long cur = x, best = x;
        for (int i = 1; i < n; i++) {
            x = sc.nextLong();
            cur = Math.max(x, cur + x);
            best = Math.max(best, cur);
        }
        System.out.println(best);
    }
}
`,
    },
    marks: 30,
    testCases: [
      {
        input: "9\n-2 1 -3 4 -1 2 1 -5 4",
        rawInput: "9\n-2 1 -3 4 -1 2 1 -5 4",
        expectedOutput: "6",
        isHidden: false,
      },
      {
        input: "1\n1",
        rawInput: "1\n1",
        expectedOutput: "1",
        isHidden: false,
      },
      {
        input: "5\n5 4 -1 7 8",
        rawInput: "5\n5 4 -1 7 8",
        expectedOutput: "23",
        isHidden: true,
      },
    ],
    hints: [
      "Kadane's algorithm: at each position i, either add the number to the current subarray or start a new subarray.",
      "cur_sum = max(nums[i], cur_sum + nums[i])",
    ],
  },
  {
    title: "Group Anagrams Count",
    difficulty: "medium",
    topic: "Hash Tables",
    description:
      "Given an array of `n` strings, group the anagrams together. Print the number of distinct anagram groups.",
    examples: [
      {
        input: "6\neat tea tan ate nat bat",
        output: "3",
        explanation: "The 3 groups are: ['eat','tea','ate'], ['tan','nat'], and ['bat'].",
      },
      {
        input: "1\na",
        output: "1",
        explanation: "Only 1 group.",
      },
    ],
    constraints: ["1 <= n <= 10^4", "0 <= words[i].length <= 100", "words[i] consists of lowercase English letters."],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    words = tokens[1:1+n]
    
    groups = {}
    for w in words:
        key = "".join(sorted(w))
        groups.setdefault(key, []).append(w)
    print(len(groups))

if __name__ == "__main__":
    solve()
`,
      c: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int cmpChar(const void *a, const void *b) {
    return (*(char*)a - *(char*)b);
}

int cmpStr(const void *a, const void *b) {
    return strcmp(*(const char**)a, *(const char**)b);
}

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    char **keys = (char**)malloc(n * sizeof(char*));
    for (int i = 0; i < n; i++) {
        char buf[105];
        scanf("%s", buf);
        qsort(buf, strlen(buf), sizeof(char), cmpChar);
        keys[i] = strdup(buf);
    }
    qsort(keys, n, sizeof(char*), cmpStr);
    int groups = (n > 0) ? 1 : 0;
    for (int i = 1; i < n; i++) {
        if (strcmp(keys[i], keys[i-1]) != 0) groups++;
    }
    printf("%d\\n", groups);
    return 0;
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    unordered_map<string, int> groups;
    for (int i = 0; i < n; i++) {
        string w;
        cin >> w;
        string key = w;
        sort(key.begin(), key.end());
        groups[key]++;
    }
    cout << groups.size() << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        Map<String, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String w = sc.next();
            char[] chars = w.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            map.put(key, map.getOrDefault(key, 0) + 1);
        }
        System.out.println(map.size());
    }
}
`,
    },
    marks: 30,
    testCases: [
      {
        input: "6\neat tea tan ate nat bat",
        rawInput: "6\neat tea tan ate nat bat",
        expectedOutput: "3",
        isHidden: false,
      },
      {
        input: "1\na",
        rawInput: "1\na",
        expectedOutput: "1",
        isHidden: false,
      },
      {
        input: "4\nab ba cd dc",
        rawInput: "4\nab ba cd dc",
        expectedOutput: "2",
        isHidden: true,
      },
    ],
    hints: [
      "Two words are anagrams if and only if their sorted character sequences are equal.",
      "Use the sorted string as a hash map key.",
    ],
  },
  {
    title: "Maximum Depth of Binary Tree",
    difficulty: "medium",
    topic: "Trees",
    description:
      "Given the level order representation of a binary tree where -1 denotes a null node, compute and return the maximum depth (height) of the binary tree.",
    examples: [
      {
        input: "7\n3 9 20 -1 -1 15 7",
        output: "3",
        explanation: "Root 3 has left child 9 (depth 2) and right child 20. 20 has children 15 and 7 (depth 3).",
      },
      {
        input: "2\n1 -1",
        output: "1",
        explanation: "Only root node exists.",
      },
    ],
    constraints: ["0 <= nodes <= 10^4", "-1000 <= node.val <= 1000"],
    starterCode: {
      python: `import sys
from collections import deque

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        print(0)
        return
    n = int(tokens[0])
    if n == 0:
        print(0)
        return
    vals = [int(x) for x in tokens[1:1+n]]
    if vals[0] == -1:
        print(0)
        return
        
    # BFS to calculate height
    queue = deque([(0, 1)]) # (index in vals, depth)
    max_depth = 1
    while queue:
        idx, depth = queue.popleft()
        max_depth = max(max_depth, depth)
        left = 2 * idx + 1
        right = 2 * idx + 2
        if left < n and vals[left] != -1:
            queue.append((left, depth + 1))
        if right < n and vals[right] != -1:
            queue.append((right, depth + 1))
    print(max_depth)

if __name__ == "__main__":
    solve()
`,
      c: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1 || n == 0) {
        printf("0\\n");
        return 0;
    }
    int vals[10005];
    for (int i = 0; i < n; i++) scanf("%d", &vals[i]);
    if (vals[0] == -1) {
        printf("0\\n");
        return 0;
    }
    int depth[10005];
    depth[0] = 1;
    int max_d = 1;
    for (int i = 0; i < n; i++) {
        if (vals[i] != -1) {
            if (depth[i] > max_d) max_d = depth[i];
            int l = 2 * i + 1;
            int r = 2 * i + 2;
            if (l < n && vals[l] != -1) depth[l] = depth[i] + 1;
            if (r < n && vals[r] != -1) depth[r] = depth[i] + 1;
        }
    }
    printf("%d\\n", max_d);
    return 0;
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    if (!(cin >> n) || n == 0) {
        cout << 0 << "\\n";
        return 0;
    }
    vector<int> vals(n);
    for (int i = 0; i < n; i++) cin >> vals[i];
    if (vals[0] == -1) {
        cout << 0 << "\\n";
        return 0;
    }
    queue<pair<int, int>> q;
    q.push({0, 1});
    int max_depth = 1;
    while (!q.empty()) {
        auto [idx, d] = q.front();
        q.pop();
        max_depth = max(max_depth, d);
        int l = 2 * idx + 1;
        int r = 2 * idx + 2;
        if (l < n && vals[l] != -1) q.push({l, d + 1});
        if (r < n && vals[r] != -1) q.push({r, d + 1});
    }
    cout << max_depth << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) {
            System.out.println(0);
            return;
        }
        int n = sc.nextInt();
        if (n == 0) {
            System.out.println(0);
            return;
        }
        int[] vals = new int[n];
        for (int i = 0; i < n; i++) vals[i] = sc.nextInt();
        if (vals[0] == -1) {
            System.out.println(0);
            return;
        }
        Queue<int[]> q = new LinkedList<>();
        q.offer(new int[]{0, 1});
        int maxDepth = 1;
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            int idx = cur[0];
            int d = cur[1];
            maxDepth = Math.max(maxDepth, d);
            int l = 2 * idx + 1;
            int r = 2 * idx + 2;
            if (l < n && vals[l] != -1) q.offer(new int[]{l, d + 1});
            if (r < n && vals[r] != -1) q.offer(new int[]{r, d + 1});
        }
        System.out.println(maxDepth);
    }
}
`,
    },
    marks: 30,
    testCases: [
      {
        input: "7\n3 9 20 -1 -1 15 7",
        rawInput: "7\n3 9 20 -1 -1 15 7",
        expectedOutput: "3",
        isHidden: false,
      },
      {
        input: "2\n1 -1",
        rawInput: "2\n1 -1",
        expectedOutput: "1",
        isHidden: false,
      },
      {
        input: "3\n1 2 3",
        rawInput: "3\n1 2 3",
        expectedOutput: "2",
        isHidden: true,
      },
    ],
    hints: [
      "Use Breadth-First Search (BFS) level order traversal or recursive DFS.",
      "Children of node at index i are located at 2*i + 1 and 2*i + 2.",
    ],
  },
  {
    title: "Number of Connected Components",
    difficulty: "medium",
    topic: "Graphs",
    description:
      "You have a graph of `n` nodes labeled from 0 to n - 1. You are given integer `n` and `m` edges. Calculate and return the number of connected components in the graph.",
    examples: [
      {
        input: "5 3\n0 1\n1 2\n3 4",
        output: "2",
        explanation: "Component 1: {0, 1, 2}, Component 2: {3, 4}. Total = 2.",
      },
      {
        input: "5 4\n0 1\n1 2\n2 3\n3 4",
        output: "1",
        explanation: "All nodes connected together into 1 component.",
      },
    ],
    constraints: ["1 <= n <= 2000", "0 <= m <= 5000", "No duplicate edges or self loops."],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    m = int(tokens[1])
    
    parent = list(range(n))
    def find(i):
        if parent[i] == i:
            return i
        parent[i] = find(parent[i])
        return parent[i]
    
    def union(i, j):
        root_i = find(i)
        root_j = find(j)
        if root_i != root_j:
            parent[root_i] = root_j
            return True
        return False
        
    components = n
    idx = 2
    for _ in range(m):
        u = int(tokens[idx])
        v = int(tokens[idx+1])
        idx += 2
        if union(u, v):
            components -= 1
    print(components)

if __name__ == "__main__":
    solve()
`,
      c: `#include <stdio.h>

int parent[2005];

int find(int i) {
    if (parent[i] == i) return i;
    return parent[i] = find(parent[i]);
}

int main() {
    int n, m;
    if (scanf("%d %d", &n, &m) != 2) return 0;
    for (int i = 0; i < n; i++) parent[i] = i;
    int comps = n;
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        int ru = find(u), rv = find(v);
        if (ru != rv) {
            parent[ru] = rv;
            comps--;
        }
    }
    printf("%d\\n", comps);
    return 0;
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct DSU {
    vector<int> parent;
    int components;
    DSU(int n) : parent(n), components(n) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int i) {
        return parent[i] == i ? i : parent[i] = find(parent[i]);
    }
    void unite(int i, int j) {
        int ri = find(i), rj = find(j);
        if (ri != rj) {
            parent[ri] = rj;
            components--;
        }
    }
};

int main() {
    int n, m;
    if (!(cin >> n >> m)) return 0;
    DSU dsu(n);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        dsu.unite(u, v);
    }
    cout << dsu.components << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    static int find(int[] parent, int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent, parent[i]);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int m = sc.nextInt();
        int[] parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        int comps = n;
        for (int i = 0; i < m; i++) {
            int u = sc.nextInt();
            int v = sc.nextInt();
            int ru = find(parent, u);
            int rv = find(parent, v);
            if (ru != rv) {
                parent[ru] = rv;
                comps--;
            }
        }
        System.out.println(comps);
    }
}
`,
    },
    marks: 30,
    testCases: [
      {
        input: "5 3\n0 1\n1 2\n3 4",
        rawInput: "5 3\n0 1\n1 2\n3 4",
        expectedOutput: "2",
        isHidden: false,
      },
      {
        input: "5 4\n0 1\n1 2\n2 3\n3 4",
        rawInput: "5 4\n0 1\n1 2\n2 3\n3 4",
        expectedOutput: "1",
        isHidden: false,
      },
      {
        input: "4 0",
        rawInput: "4 0",
        expectedOutput: "4",
        isHidden: true,
      },
    ],
    hints: [
      "Use Disjoint Set Union (DSU / Union-Find) to merge connected vertices.",
      "Start with n disjoint sets, decrement count on each successful union.",
    ],
  },

  // =========================================================================
  // HARD (6 QUESTIONS)
  // =========================================================================
  {
    title: "Longest Increasing Subsequence",
    difficulty: "hard",
    topic: "Dynamic Programming",
    description:
      "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.\n\nAn optimal solution runs in O(n log n) time using binary search patience sorting.",
    examples: [
      {
        input: "8\n10 9 2 5 3 7 101 18",
        output: "4",
        explanation: "The longest increasing subsequence is [2, 3, 7, 101], therefore the length is 4.",
      },
      {
        input: "6\n0 1 0 3 2 3",
        output: "4",
        explanation: "The LIS is [0, 1, 2, 3] with length 4.",
      },
      {
        input: "7\n7 7 7 7 7 7 7",
        output: "1",
        explanation: "Strictly increasing means length is 1.",
      },
    ],
    constraints: ["1 <= nums.length <= 2500", "-10^4 <= nums[i] <= 10^4"],
    starterCode: {
      python: `import sys
import bisect

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:1+n]]
    
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
    print(len(tails))

if __name__ == "__main__":
    solve()
`,
      c: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int nums[2505], tails[2505];
    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);
    int len = 0;
    for (int i = 0; i < n; i++) {
        int l = 0, r = len;
        while (l < r) {
            int mid = l + (r - l) / 2;
            if (tails[mid] < nums[i]) l = mid + 1;
            else r = mid;
        }
        tails[l] = nums[i];
        if (l == len) len++;
    }
    printf("%d\\n", len);
    return 0;
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    vector<int> tails;
    for (int x : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    cout << tails.size() << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        List<Integer> tails = new ArrayList<>();
        for (int x : nums) {
            int idx = Collections.binarySearch(tails, x);
            if (idx < 0) idx = -(idx + 1);
            if (idx == tails.size()) tails.add(x);
            else tails.set(idx, x);
        }
        System.out.println(tails.size());
    }
}
`,
    },
    marks: 30,
    testCases: [
      {
        input: "8\n10 9 2 5 3 7 101 18",
        rawInput: "8\n10 9 2 5 3 7 101 18",
        expectedOutput: "4",
        isHidden: false,
      },
      {
        input: "6\n0 1 0 3 2 3",
        rawInput: "6\n0 1 0 3 2 3",
        expectedOutput: "4",
        isHidden: false,
      },
      {
        input: "7\n7 7 7 7 7 7 7",
        rawInput: "7\n7 7 7 7 7 7 7",
        expectedOutput: "1",
        isHidden: true,
      },
    ],
    hints: [
      "DP approach is O(N^2), but patience sorting with binary search achieves O(N log N).",
      "Maintain a 'tails' array where tails[i] stores the smallest tail of all increasing subsequences of length i+1.",
    ],
  },
  {
    title: "Trapping Rain Water",
    difficulty: "hard",
    topic: "Arrays",
    description:
      "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    examples: [
      {
        input: "12\n0 1 0 2 1 0 1 3 2 1 2 1",
        output: "6",
        explanation: "Elevation map traps 6 units of rain water.",
      },
      {
        input: "6\n4 2 0 3 2 5",
        output: "9",
        explanation: "Traps 9 units of rain water.",
      },
    ],
    constraints: ["1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    height = [int(x) for x in tokens[1:1+n]]
    
    left, right = 0, n - 1
    left_max, right_max = 0, 0
    ans = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                ans += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                ans += right_max - height[right]
            right -= 1
    print(ans)

if __name__ == "__main__":
    solve()
`,
      c: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int h[20005];
    for (int i = 0; i < n; i++) scanf("%d", &h[i]);
    int left = 0, right = n - 1;
    int left_max = 0, right_max = 0;
    long long ans = 0;
    while (left < right) {
        if (h[left] < h[right]) {
            if (h[left] >= left_max) left_max = h[left];
            else ans += left_max - h[left];
            left++;
        } else {
            if (h[right] >= right_max) right_max = h[right];
            else ans += right_max - h[right];
            right--;
        }
    }
    printf("%lld\\n", ans);
    return 0;
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> h(n);
    for (int i = 0; i < n; i++) cin >> h[i];
    int left = 0, right = n - 1;
    int left_max = 0, right_max = 0;
    long long ans = 0;
    while (left < right) {
        if (h[left] < h[right]) {
            if (h[left] >= left_max) left_max = h[left];
            else ans += left_max - h[left];
            left++;
        } else {
            if (h[right] >= right_max) right_max = h[right];
            else ans += right_max - h[right];
            right--;
        }
    }
    cout << ans << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] h = new int[n];
        for (int i = 0; i < n; i++) h[i] = sc.nextInt();
        int left = 0, right = n - 1;
        int leftMax = 0, rightMax = 0;
        long ans = 0;
        while (left < right) {
            if (h[left] < h[right]) {
                if (h[left] >= leftMax) leftMax = h[left];
                else ans += leftMax - h[left];
                left++;
            } else {
                if (h[right] >= rightMax) rightMax = h[right];
                else ans += rightMax - h[right];
                right--;
            }
        }
        System.out.println(ans);
    }
}
`,
    },
    marks: 30,
    testCases: [
      {
        input: "12\n0 1 0 2 1 0 1 3 2 1 2 1",
        rawInput: "12\n0 1 0 2 1 0 1 3 2 1 2 1",
        expectedOutput: "6",
        isHidden: false,
      },
      {
        input: "6\n4 2 0 3 2 5",
        rawInput: "6\n4 2 0 3 2 5",
        expectedOutput: "9",
        isHidden: false,
      },
      {
        input: "3\n2 0 2",
        rawInput: "3\n2 0 2",
        expectedOutput: "2",
        isHidden: true,
      },
    ],
    hints: [
      "Use the two-pointer technique to solve in O(N) time and O(1) space.",
      "The amount of water at index i is determined by min(max_left, max_right) - height[i].",
    ],
  },
  {
    title: "Edit Distance",
    difficulty: "hard",
    topic: "Dynamic Programming",
    description:
      "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.\n\nYou have the following three operations permitted on a word: Insert a character, Delete a character, Replace a character.",
    examples: [
      {
        input: "horse ros",
        output: "3",
        explanation: "horse -> rorse (replace 'h' with 'r') -> rose (remove 'r') -> ros (remove 'e').",
      },
      {
        input: "intention execution",
        output: "5",
        explanation: "5 operations to convert.",
      },
    ],
    constraints: ["0 <= word1.length, word2.length <= 500", "Words consist of lowercase English letters."],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        print(0)
        return
    w1 = tokens[0] if len(tokens) > 0 else ""
    w2 = tokens[1] if len(tokens) > 1 else ""
    
    m, n = len(w1), len(w2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
        
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if w1[i - 1] == w2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    print(dp[m][n])

if __name__ == "__main__":
    solve()
`,
      c: `#include <stdio.h>
#include <string.h>

int min3(int a, int b, int c) {
    int m = (a < b) ? a : b;
    return (m < c) ? m : c;
}

int main() {
    char w1[505], w2[505];
    if (scanf("%s %s", w1, w2) != 2) return 0;
    int m = strlen(w1), n = strlen(w2);
    int dp[505][505];
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (w1[i - 1] == w2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + min3(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    printf("%d\\n", dp[m][n]);
    return 0;
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string w1, w2;
    if (!(cin >> w1 >> w2)) return 0;
    int m = w1.length(), n = w2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (w1[i - 1] == w2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
        }
    }
    cout << dp[m][n] << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String w1 = sc.next();
        String w2 = sc.next();
        int m = w1.length(), n = w2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (w1.charAt(i - 1) == w2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];
                else dp[i][j] = 1 + Math.min(dp[i - 1][j], Math.min(dp[i][j - 1], dp[i - 1][j - 1]));
            }
        }
        System.out.println(dp[m][n]);
    }
}
`,
    },
    marks: 30,
    testCases: [
      {
        input: "horse ros",
        rawInput: "horse ros",
        expectedOutput: "3",
        isHidden: false,
      },
      {
        input: "intention execution",
        rawInput: "intention execution",
        expectedOutput: "5",
        isHidden: false,
      },
      {
        input: "abc abc",
        rawInput: "abc abc",
        expectedOutput: "0",
        isHidden: true,
      },
    ],
    hints: [
      "Standard 2D Dynamic Programming problem.",
      "dp[i][j] represents min operations to convert w1[0..i] to w2[0..j].",
    ],
  },
  {
    title: "Median of Two Sorted Arrays",
    difficulty: "hard",
    topic: "Searching",
    description:
      "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays. Output as formatted decimal (e.g., 2.0 or 2.5).",
    examples: [
      {
        input: "2 2\n1 3\n2 4",
        output: "2.5",
        explanation: "Merged array = [1, 2, 3, 4] and median is (2 + 3) / 2 = 2.5.",
      },
      {
        input: "2 1\n1 3\n2",
        output: "2.0",
        explanation: "Merged array = [1, 2, 3] and median is 2.",
      },
    ],
    constraints: ["0 <= m, n <= 1000", "1 <= m + n <= 2000", "-10^6 <= nums[i] <= 10^6"],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    m = int(tokens[1])
    a = [int(x) for x in tokens[2:2+n]]
    b = [int(x) for x in tokens[2+n:2+n+m]]
    merged = sorted(a + b)
    total = len(merged)
    if total % 2 == 1:
        print(f"{float(merged[total // 2]):.1f}")
    else:
        med = (merged[total // 2 - 1] + merged[total // 2]) / 2.0
        print(f"{med:.1f}")

if __name__ == "__main__":
    solve()
`,
      c: `#include <stdio.h>
#include <stdlib.h>

int cmp(const void* a, const void* b) {
    return (*(int*)a - *(int*)b);
}

int main() {
    int n, m;
    if (scanf("%d %d", &n, &m) != 2) return 0;
    int arr[2005];
    for (int i = 0; i < n + m; i++) scanf("%d", &arr[i]);
    qsort(arr, n + m, sizeof(int), cmp);
    int tot = n + m;
    if (tot % 2 == 1) {
        printf("%.1f\\n", (double)arr[tot / 2]);
    } else {
        printf("%.1f\\n", (arr[tot / 2 - 1] + arr[tot / 2]) / 2.0);
    }
    return 0;
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<int> a(n + m);
    for (int i = 0; i < n + m; i++) cin >> a[i];
    sort(a.begin(), a.end());
    int tot = n + m;
    if (tot % 2 == 1) {
        cout << fixed << setprecision(1) << (double)a[tot / 2] << "\\n";
    } else {
        cout << fixed << setprecision(1) << (a[tot / 2 - 1] + a[tot / 2]) / 2.0 << "\\n";
    }
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int m = sc.nextInt();
        int[] arr = new int[n + m];
        for (int i = 0; i < n + m; i++) arr[i] = sc.nextInt();
        Arrays.sort(arr);
        int tot = n + m;
        if (tot % 2 == 1) {
            System.out.printf(Locale.US, "%.1f\\n", (double)arr[tot / 2]);
        } else {
            System.out.printf(Locale.US, "%.1f\\n", (arr[tot / 2 - 1] + arr[tot / 2]) / 2.0);
        }
    }
}
`,
    },
    marks: 30,
    testCases: [
      {
        input: "2 2\n1 3\n2 4",
        rawInput: "2 2\n1 3\n2 4",
        expectedOutput: "2.5",
        isHidden: false,
      },
      {
        input: "2 1\n1 3\n2",
        rawInput: "2 1\n1 3\n2",
        expectedOutput: "2.0",
        isHidden: false,
      },
      {
        input: "2 2\n0 0\n0 0",
        rawInput: "2 2\n0 0\n0 0",
        expectedOutput: "0.0",
        isHidden: true,
      },
    ],
    hints: [
      "Can be solved in O(log(min(m, n))) by partitioning both arrays binary-search style.",
      "Ensure max(leftA, leftB) <= min(rightA, rightB).",
    ],
  },
  {
    title: "Word Ladder Length",
    difficulty: "hard",
    topic: "Graphs",
    description:
      "A transformation sequence from word `beginWord` to `endWord` using a dictionary `wordList` is a sequence of words where adjacent words differ by exactly 1 character. Return the number of words in the shortest transformation sequence, or 0 if no sequence exists.",
    examples: [
      {
        input: "hit cog 5\nhot dot dog lot log",
        output: "5",
        explanation: "Shortest sequence: hit -> hot -> dot -> dog -> cog (5 words).",
      },
      {
        input: "hit cog 4\nhot dot dog lot",
        output: "0",
        explanation: "The endWord 'cog' is not reachable.",
      },
    ],
    constraints: ["1 <= wordList.length <= 5000", "beginWord.length <= 10"],
    starterCode: {
      python: `import sys
from collections import deque

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    begin_word = tokens[0]
    end_word = tokens[1]
    n = int(tokens[2])
    word_set = set(tokens[3:3+n])
    
    if end_word not in word_set and end_word != "cog":
        # Check if reachable
        pass
    word_set.add(end_word)
    
    queue = deque([(begin_word, 1)])
    visited = {begin_word}
    
    while queue:
        word, step = queue.popleft()
        if word == end_word:
            print(step)
            return
        for i in range(len(word)):
            for c in "abcdefghijklmnopqrstuvwxyz":
                nxt = word[:i] + c + word[i+1:]
                if nxt in word_set and nxt not in visited:
                    visited.add(nxt)
                    queue.append((nxt, step + 1))
    print(0)

if __name__ == "__main__":
    solve()
`,
      c: `#include <stdio.h>
#include <string.h>

int diff1(char *a, char *b) {
    int d = 0;
    while (*a && *b) {
        if (*a != *b) d++;
        a++; b++;
    }
    return d == 1;
}

int main() {
    char begin[15], end[15];
    int n;
    if (scanf("%s %s %d", begin, end, &n) != 3) return 0;
    char words[5005][15];
    int has_end = 0;
    for (int i = 0; i < n; i++) {
        scanf("%s", words[i]);
        if (strcmp(words[i], end) == 0) has_end = 1;
    }
    if (!has_end) {
        strcpy(words[n++], end);
    }
    int q[5005], dist[5005], front = 0, rear = 0, vis[5005] = {0};
    for (int i = 0; i < n; i++) {
        if (diff1(begin, words[i])) {
            q[rear] = i;
            dist[rear] = 2;
            vis[i] = 1;
            rear++;
        }
    }
    while (front < rear) {
        int u = q[front];
        int d = dist[front++];
        if (strcmp(words[u], end) == 0) {
            printf("%d\\n", d);
            return 0;
        }
        for (int i = 0; i < n; i++) {
            if (!vis[i] && diff1(words[u], words[i])) {
                vis[i] = 1;
                q[rear] = i;
                dist[rear++] = d + 1;
            }
        }
    }
    printf("0\\n");
    return 0;
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string beginWord, endWord;
    int n;
    if (!(cin >> beginWord >> endWord >> n)) return 0;
    unordered_set<string> wordSet;
    for (int i = 0; i < n; i++) {
        string w;
        cin >> w;
        wordSet.insert(w);
    }
    wordSet.insert(endWord);
    queue<pair<string, int>> q;
    unordered_set<string> vis;
    q.push({beginWord, 1});
    vis.insert(beginWord);
    while (!q.empty()) {
        auto [w, step] = q.front();
        q.pop();
        if (w == endWord) {
            cout << step << "\\n";
            return 0;
        }
        for (int i = 0; i < w.length(); i++) {
            char orig = w[i];
            for (char c = 'a'; c <= 'z'; c++) {
                w[i] = c;
                if (wordSet.count(w) && !vis.count(w)) {
                    vis.insert(w);
                    q.push({w, step + 1});
                }
            }
            w[i] = orig;
        }
    }
    cout << 0 << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String beginWord = sc.next();
        String endWord = sc.next();
        int n = sc.nextInt();
        Set<String> set = new HashSet<>();
        for (int i = 0; i < n; i++) set.add(sc.next());
        set.add(endWord);
        Queue<String> q = new LinkedList<>();
        Queue<Integer> steps = new LinkedList<>();
        Set<String> vis = new HashSet<>();
        q.offer(beginWord);
        steps.offer(1);
        vis.add(beginWord);
        while (!q.isEmpty()) {
            String w = q.poll();
            int s = steps.poll();
            if (w.equals(endWord)) {
                System.out.println(s);
                return;
            }
            char[] chars = w.toCharArray();
            for (int i = 0; i < chars.length; i++) {
                char orig = chars[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    chars[i] = c;
                    String next = new String(chars);
                    if (set.contains(next) && vis.add(next)) {
                        q.offer(next);
                        steps.offer(s + 1);
                    }
                }
                chars[i] = orig;
            }
        }
        System.out.println(0);
    }
}
`,
    },
    marks: 30,
    testCases: [
      {
        input: "hit cog 5\nhot dot dog lot log",
        rawInput: "hit cog 5\nhot dot dog lot log",
        expectedOutput: "5",
        isHidden: false,
      },
      {
        input: "hit cog 4\nhot dot dog lot",
        rawInput: "hit cog 4\nhot dot dog lot",
        expectedOutput: "0",
        isHidden: false,
      },
      {
        input: "a c 2\na b",
        rawInput: "a c 2\na b",
        expectedOutput: "0",
        isHidden: true,
      },
    ],
    hints: [
      "Model this as an unweighted graph where an edge exists between words that differ by 1 letter.",
      "Use Breadth-First Search (BFS) to find the shortest path from beginWord to endWord.",
    ],
  },
  {
    title: "Binary Tree Maximum Path Sum",
    difficulty: "hard",
    topic: "Trees",
    description:
      "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Given tree nodes in level order (-1 for null), compute the maximum path sum.",
    examples: [
      {
        input: "5\n-10 9 20 15 7",
        output: "42",
        explanation: "The optimal path is 15 -> 20 -> 7 with sum 15 + 20 + 7 = 42.",
      },
      {
        input: "3\n1 2 3",
        output: "6",
        explanation: "The path 2 -> 1 -> 3 has sum 6.",
      },
    ],
    constraints: ["1 <= nodes <= 10^4", "-1000 <= Node.val <= 1000"],
    starterCode: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    vals = [int(x) for x in tokens[1:1+n]]
    
    max_sum = float('-inf')
    
    def dfs(idx):
        nonlocal max_sum
        if idx >= n or vals[idx] == -1:
            return 0
        left_gain = max(dfs(2 * idx + 1), 0)
        right_gain = max(dfs(2 * idx + 2), 0)
        path_sum = vals[idx] + left_gain + right_gain
        max_sum = max(max_sum, path_sum)
        return vals[idx] + max(left_gain, right_gain)
        
    dfs(0)
    print(max_sum)

if __name__ == "__main__":
    solve()
`,
      c: `#include <stdio.h>

int vals[10005];
int n;
long long max_sum = -1000000000LL;

long long max2(long long a, long long b) { return a > b ? a : b; }

long long dfs(int idx) {
    if (idx >= n || vals[idx] == -1) return 0;
    long long left = max2(dfs(2 * idx + 1), 0);
    long long right = max2(dfs(2 * idx + 2), 0);
    long long path = vals[idx] + left + right;
    if (path > max_sum) max_sum = path;
    return vals[idx] + max2(left, right);
}

int main() {
    if (scanf("%d", &n) != 1) return 0;
    for (int i = 0; i < n; i++) scanf("%d", &vals[i]);
    dfs(0);
    printf("%lld\\n", max_sum);
    return 0;
}
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

long long maxSum = LLONG_MIN;
int n;
vector<int> vals;

long long dfs(int idx) {
    if (idx >= n || vals[idx] == -1) return 0;
    long long left = max(0LL, dfs(2 * idx + 1));
    long long right = max(0LL, dfs(2 * idx + 2));
    long long path = vals[idx] + left + right;
    maxSum = max(maxSum, path);
    return vals[idx] + max(left, right);
}

int main() {
    if (!(cin >> n)) return 0;
    vals.resize(n);
    for (int i = 0; i < n; i++) cin >> vals[i];
    dfs(0);
    cout << maxSum << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    static long maxSum = Long.MIN_VALUE;
    static int n;
    static int[] vals;

    static long dfs(int idx) {
        if (idx >= n || vals[idx] == -1) return 0;
        long left = Math.max(0, dfs(2 * idx + 1));
        long right = Math.max(0, dfs(2 * idx + 2));
        long path = vals[idx] + left + right;
        maxSum = Math.max(maxSum, path);
        return vals[idx] + Math.max(left, right);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        n = sc.nextInt();
        vals = new int[n];
        for (int i = 0; i < n; i++) vals[i] = sc.nextInt();
        dfs(0);
        System.out.println(maxSum);
    }
}
`,
    },
    marks: 30,
    testCases: [
      {
        input: "5\n-10 9 20 15 7",
        rawInput: "5\n-10 9 20 15 7",
        expectedOutput: "42",
        isHidden: false,
      },
      {
        input: "3\n1 2 3",
        rawInput: "3\n1 2 3",
        expectedOutput: "6",
        isHidden: false,
      },
      {
        input: "1\n-3",
        rawInput: "1\n-3",
        expectedOutput: "-3",
        isHidden: true,
      },
    ],
    hints: [
      "Use recursive post-order traversal to calculate max gain from left and right subtrees.",
      "At each node, calculate the sum if the highest path turns at this node (val + left_gain + right_gain).",
    ],
  },
];

const STARTER_CODE_TEMPLATES = {
  python: `def solve():
    # Write your code here
    pass

if __name__ == "__main__":
    solve()
`,
  c: `#include <stdio.h>

int main() {
    // Write your code here

    return 0;
}
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here

    return 0;
}
`,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}
`,
};

async function seedDSA() {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/prepgo";
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully.");

    console.log("Clearing existing DSA questions...");
    await DSAQuestion.deleteMany({});

    const questionsToInsert = questions.map((q) => ({
      ...q,
      solution: q.starterCode,
      starterCode: STARTER_CODE_TEMPLATES,
    }));

    console.log(`Inserting ${questionsToInsert.length} DSA questions with clean starterCode templates...`);
    const inserted = await DSAQuestion.insertMany(questionsToInsert);
    console.log(`Successfully seeded ${inserted.length} DSA questions!`);

    const counts = {
      easy: await DSAQuestion.countDocuments({ difficulty: "easy" }),
      medium: await DSAQuestion.countDocuments({ difficulty: "medium" }),
      hard: await DSAQuestion.countDocuments({ difficulty: "hard" }),
    };
    console.log("Questions distribution:", counts);

    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding DSA questions:", err);
    process.exit(1);
  }
}

seedDSA();

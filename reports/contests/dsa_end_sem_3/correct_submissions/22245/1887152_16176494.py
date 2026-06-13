t = int(input())
for _ in range(t):
    # Write your code here
    n, target = map(int, input().split())
    nums = list(map(int, input().split()))
    found = False
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            for k in range(j+1, len(nums)):
                if nums[i] + nums[j] + nums[k] == target:
                    found = True
    print("YES" if found else "NO")
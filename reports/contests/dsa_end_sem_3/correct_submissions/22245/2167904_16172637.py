t = int(input())
for _ in range(t):
    n, target = map(int, input().split())
    nums = list(map(int, input().split()))
    found = False
    for i in range(n-2):
        for j in range(i+1, n-1):
            for k in range(j+1, n):
                if (nums[i] + nums[j] + nums[k] == target):
                    found = True
                    break
                
    if found == False:
        print("NO")
    else:
        print("YES")
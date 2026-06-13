t = int(input())
for _ in range(t):
    n,target = map(int,input().split())
    nums = list(map(int,input().split()))
    found = -1
    for i in range(n):
        for j in range(i+1,n):
            for k in range(j+1,n):
                if nums[i] + nums[j] + nums[k] == target:
                    found = 0
    if found == -1:
        print("NO")
    else:
        print("YES")
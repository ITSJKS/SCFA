t = int(input())
for _ in range(t):
    n,x = map(int,input().split())
    nums = list(map(int,input().split()))
    found = False
    for i in range(n):
        for j in range(i+1,n):
            for k in range(j+1,n):
                if nums[i]+nums[j]+nums[k]==x:
                    found = True
                    break
    if found:
        print("YES")
    else:
        print("NO")
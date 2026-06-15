t = int(input())
for _ in range(t):
    # Write your code here
    n,target=map(int,input().split())
    nums=list(map(int,input().split()))
    check=False
    for i in range(n):
        for j in range(n):
            for k in range(n):
                if nums[i]+nums[j]+nums[k]==target and (i!=j!=k and i!=j and i!=k and j!=k): 
                    check=True
                    break
    if check: print("YES")
    else: print("NO")
t = int(input())
for _ in range(t):
    # Write your code here
    n,t = map(int,input().split())
    nums = list(map(int,input().split()))
    f = False
    for i in range(n):
        for j in range(i+1,n):
            for k in range(j+1,n):
                if nums[i]+nums[j]+nums[k]==t:
                    f = True
    
    if f:
        print("YES")
    else:
        print("NO")
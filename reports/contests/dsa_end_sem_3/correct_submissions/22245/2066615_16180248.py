t = int(input())
for _ in range(t):
    n,target=map(int,input().split())
    nums=list(map(int,input().split()))
    flag=False
    for i in range(0,n-2):
        for j in range(i+1,n-1):
            for k in range(j+1,n):
                if nums[i]+nums[j]+nums[k]==target:
                    flag=True
    if flag==True:
        print("YES")
    else:
        print("NO")
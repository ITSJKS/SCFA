t = int(input())
for _ in range(t):
    # Write your code here
    flag=False
    n,target=map(int,input().split())
    nums=list(map(int,input().split()))
    for i in range(0,len(nums)):
        for j in range(i+1,len(nums)):
            for k in range(j+1,len(nums)):
                if nums[i]+nums[j]+nums[k]==target:
                    flag=True
    if flag==True:
        print("YES")
    else:
        print("NO")
t = int(input())
for _ in range(t):
    # Write your code here
    n,target=map(int,input().split())
    nums=list(map(int,input().split()))
    nums.sort()
    for i in range(n):
        l=i+1
        r=n-1
        c=0
        while l<r:
            if nums[i]+nums[l]+nums[r]==target:
                c=1
                break
            elif nums[i]+nums[l]+nums[r]<target:
                l+=1
            else:
                r-=1
        if c==1:
            break
    if c==0:
        print("NO")
    else:
        print("YES")
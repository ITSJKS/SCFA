t = int(input())
for _ in range(t):
    # Write your code here
    n,target=map(int,input().split())
    nums=list(map(int,input().split()))
    l=len(nums)
    f=False
    for i in range(l):
        for j in range(i+1,l):
            for k in range(j+1,l):
                if(nums[i]+nums[j]+nums[k]==target):
                    f=True
                    break
            if(f):
                break
        if(f):
            break
    if(f):
        print("YES")
    else:
        print("NO")
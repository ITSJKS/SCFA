t = int(input())
for _ in range(t):
    # Write your code here
    n,target=map(int, input().split())
    nums=list(map(int, input().split()))
    f=0
    for i in range(len(nums)-2):
        for j in range(i+1,len(nums)):
            for k in range(j+1,len(nums)):
                if nums[i]+nums[j]+nums[k]==target:
                    f=1
                    print("YES")
                    break
            if f==1:
                break
        if f==1:
            break
                    
    if f==0:
        print("NO")
t = int(input())
for _ in range(t):
    n,target=map(int,input().split())
    nums=list(map(int,input().split()))
    is_found=False
    for i in range(len(nums)):
        num1=nums[i]
        for j in range(i+1,len(nums)):
            num2=nums[j]
            for k in range(j+1,len(nums)):
                if num1+num2+nums[k]==target:
                    is_found=True
                    break
    if is_found:
        print("YES")
    else:
        print("NO")
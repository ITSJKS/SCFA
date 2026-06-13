t = int(input())
for _ in range(t):
    n,t=map(int,input().split())
    nums=list(map(int, input().split()))

    flag=False
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            for k in range(j+1,len(nums)):
                if nums[i]+nums[j]+nums[k]==t:
                    flag=True
                    print("YES")
                    break
                else:
                    flag=False
            if flag==True:
                break
        if flag==True:
            break
    if flag==False:
        print("NO")
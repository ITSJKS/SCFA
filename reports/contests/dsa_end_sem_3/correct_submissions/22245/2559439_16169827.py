q=int(input())
for _ in range(q):
    n,t=map(int,input().split())
    nums=list(map(int,input().split()))
    found=False
    l=len(nums)
    for i in range(l):
        for j in range(i+1,l):
            for k in range(j+1,l):
                if nums[i]+nums[j]+nums[k]==t:
                    found=True
                    break
            if found:
                break
        if found:
            break
    if found:
        print("YES")
    else:
        print("NO")
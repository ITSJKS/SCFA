t = int(input())
for _ in range(t):
    n,target=map(int,input().split())
    nums = list(map(int,input().split()))
    hii = False
    for i in range(n):
        for j in range (i+1,n):
            for k in range (j+1,n):
                if nums[i]+nums[j]+nums[k]==target:
                    hii = True
    if hii:
        print("YES")
    else:
        print("NO")

    # # Write your code here
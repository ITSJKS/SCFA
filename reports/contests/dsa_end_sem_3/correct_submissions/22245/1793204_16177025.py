t = int(input())
for _ in range(t):
    n , tar = map(int,input().split())
    nums = list(map(int,input().split()))
    flag = False
    for i in range(n):
        for j in range(i+1,n):
            for k in range(j+1,n):
                if nums[i]+nums[j]+nums[k] == tar:
                    flag = True
                    break
    if flag==True:
        print("YES")
    else:
        print("NO")
t = int(input())
for _ in range(t):
    n,target = map(int,input().split())
    nums = list(map(int,input().split()))
    flag = False
    for i in range(n):
        if flag == True:
            break
        for j in range(i+1,n):
            if flag == True:
                break
            for k in range(j+1,n):
                if nums[i] + nums[j] + nums[k] == target:
                    flag = True
                    break
    if flag:
        print("YES")
    else:
        print("NO")
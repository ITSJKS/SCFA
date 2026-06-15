t = int(input())
for _ in range(t):

    n,target = map(int,input().split())
    nums = list(map(int,input().split()))
    status = False

    for i in range(n-1):
        for j in range(i+1,n):
            for k in range(j+1,n):
                if nums[i] + nums[j] + nums[k] == target:
                    status = True
                        
    if status:
        print("YES")
    else:
        print("NO")
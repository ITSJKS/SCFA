t = int(input())
for _ in range(t):
    a,b = map(int,input().split())
    nums = list(map(int,input().split()))
    ans = False
    for i in range(len(nums)):
        for j in range(i+1,len(nums)):
            for k in range(j+1,len(nums)):
                if nums[i] + nums[j] + nums[k] == b:
                    ans = True
                    break

    if ans:
        print("YES")
    else:
        print("NO")
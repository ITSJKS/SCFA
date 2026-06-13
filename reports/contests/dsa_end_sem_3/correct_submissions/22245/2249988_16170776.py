t = int(input())
for _ in range(t):
    # Write your code here
    a,b = map(int,input().split())
    nums = list(map(int,input().split()))
    flag = False
    for i in range(a):
        for j in range(i+1,a):
            for k in range(j+1,a):
                if nums[i] + nums[j] + nums[k] == b:
                    flag = True

    
    if flag:
        print("YES")
    else:
        print("NO")
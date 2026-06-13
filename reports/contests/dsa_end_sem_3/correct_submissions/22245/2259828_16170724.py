t = int(input())
for _ in range(t):
    n, target = map(int, input().split())
    nums = list(map(int, input().split()))

    c = 0
    for i in range(n):
        for j in range(i+1, n):
            for k in range(j+1, n):
                if nums[i]+nums[j]+nums[k] == target:
                    c += 1

                
    if c:
        print('YES')
    else:
        print('NO')
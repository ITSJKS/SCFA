t = int(input())
for _ in range(t):
    n, target = map(int, input().split())
    a = list(map(int, input().split()))

    flag = False
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                val = a[i] + a[j] + a[k]
                if val == target:
                    flag = True
                    break
    
    print("YES" if flag else "NO")
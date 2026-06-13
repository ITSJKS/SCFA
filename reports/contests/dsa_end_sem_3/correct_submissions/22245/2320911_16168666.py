t = int(input())
for _ in range(t):
    ans = "NO"
    n, target = map(int, input().split())
    l = list(map(int, input().split()))
    for i in range(0, len(l)):
        for j in range(i+1, len(l)):
            for k in range(j+1, len(l)):
                if l[i] + l[j] + l[k] == target:
                    ans = "YES"
    print(ans)
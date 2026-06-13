t = int(input())
for _ in range(t):
    n, t = map(int, input().split())
    arr = list(map(int, input().split()))
    ans = False

    for i in range(n):
        for j in range(i+1, n):
            for k in range(j+1, n):
                if (arr[i] + arr[j] + arr[k]) == t:
                    ans = True
                    break

    
    if ans == True:
        print("YES")
    else:
        print("NO")
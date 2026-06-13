t = int(input())
for _ in range(t):
    n , tar = map(int , input().split())
    arr = list(map(int , input().split()))
    for i in range(n):
        found = False
        for j in range(i+1 , n):
            for k in range(j + 1 , n):
                if arr[i] + arr[j] + arr[k] == tar:
                    found = True
                    print('YES')
                    break
            if found:
                break
        if found:
            break
    
    if not found :
        print('NO')
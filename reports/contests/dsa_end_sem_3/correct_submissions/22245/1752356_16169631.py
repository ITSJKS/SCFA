t = int(input())
for _ in range(t):
    # Write your code here
    n, target = map(int, input().split())
    arr = list(map(int, input().split()))

    found = False

    for i in range(n):
        for j in range(i+1, n):
            for k in range(j+1, n):
                if arr[i] + arr[j] + arr[k] == target:
                    found = True

    
    print("YES" if found else 'NO')
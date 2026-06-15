t = int(input())
for _ in range(t):
    n , t = map(int,input().split())
    arr = list(map(int,input().split()))
    flag = False

    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            for z in range(j + 1 , len(arr)):
                if arr[i] + arr[j] + arr[z] == t:
                    flag = True
    if flag:
        print("YES")
    else:
        print("NO")
    # Write your code here
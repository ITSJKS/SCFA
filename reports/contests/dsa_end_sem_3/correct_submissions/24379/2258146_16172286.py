n = int(input())
a = list(map(int, input().split()))

arr = []
for x in a:
    if x > 0:
        arr.append(x)
    else:
        while True:
            if len(arr) == 0 or arr[-1] < 0:
                arr.append(x)
                break
            
            if arr[-1] == abs(x):
                arr.pop()
                break
            
            if arr[-1] > abs(x):
                break
            
            arr.pop()

print(*arr)
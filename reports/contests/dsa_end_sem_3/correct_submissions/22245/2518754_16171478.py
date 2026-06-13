t = int(input())
for _ in range(t):
    a,b = map(int,input().split())
    arr = list(map(int,input().split()))
    f = False

    for i in range(a):
        for j in range(i+1,a):
            for k in range(j+1,a):
                if arr[i]+arr[j]+arr[k]==b:
                    f = True
                    break
        if f == True:
            break
    
    if f==True:
        print("YES")
    else:
        print("NO")
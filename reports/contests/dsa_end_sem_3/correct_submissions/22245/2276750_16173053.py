t = int(input())
for _ in range(t):
    a,b=map(int,input().split())
    arr=list(map(int,input().split()))
    ar=[]
    for i in range(a):
        for j in range(a):
            for k in range(a):
                if i!=j and j!=k and k!=i:
                    ar.append(arr[i]+arr[j]+arr[k])

    # print(ar)
    if b in ar:
        print("YES")
    else:
        print("NO")
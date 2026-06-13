t = int(input())
for _ in range(t):
    a,b=map(int,input().split())
    arr=list(map(int,input().split()))
    flag=False  
    for i in range(0,a):
        for j in range(i+1,a):
            for k in range(j+1,a):
                if arr[i]+arr[j]+arr[k]==b:
                    flag = True
                    break   

    if flag:
        print("YES")
    else:
        print("NO")
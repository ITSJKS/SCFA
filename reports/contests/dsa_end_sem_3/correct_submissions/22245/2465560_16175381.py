# t = int(input())
# for _ in range(t):
#     a,b = map(int, input().split())
#     arr = list(map(int, input().split()))
#     n = len(arr)
#     var = False
#     for i in range(n):
#         for j in range(i,n):
#             for k in range(j,n):
#                 if arr[i]+arr[j]+arr[k]==b:
#                     var = True
#     if var is True:
#         print("YES")
#     else:
#         print("NO")


t = int(input())
for _ in range(t):
    var = False
    a, b = map(int, input().split())
    li = list(map(int, input().split()))
    for i in range (a):
        for j in range (i+1,a):
            for k in range (j+1,a):
                if li[i]+li[j]+li[k]==b:
                    var = True
    if var is False:
        print("NO")
    elif var is True:
        print("YES")
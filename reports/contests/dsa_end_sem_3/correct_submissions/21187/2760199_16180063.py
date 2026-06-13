n= int(input())
mat=[]
for _ in range(n):
    a = list(map(int,input().split()))
    mat.append(a)

flag = False
fl = False
for row in range(1,n):
    if mat[row][row]==mat[0][0]:
        flag = True
    else:
        flag = False
        print("No Harmony")
        break
if flag==True:
    for row in range(n):
        if mat[row][n-1-row]== mat[0][n-1]:
            fl=True
        else:
            fl = False
            print("No Harmony")
            break
if (flag and fl) or (n==1 and len(mat[0])==1):
    print("Double Harmony")
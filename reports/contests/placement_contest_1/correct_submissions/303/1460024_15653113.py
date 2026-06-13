def nextGreaterElement(arr):
    n = len(arr)
    los=[]
    for i in range(n):
        # print(arr[i])
        for j in range(i+1,n):

            if arr[i]<arr[j]:
                # print(arr[i])
                los.append(arr[j])
                break 

            elif (j==n-1 and arr[i] >= arr[j] ) :
                # print(i,j)
                
                los.append(-1)
    los.append(-1)
      


    print(*los)
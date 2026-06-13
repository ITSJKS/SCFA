def trap(arr):

    water=0
    stack=[]


    for i in range(n):
        while stack and arr[stack[-1]]<arr[i]:
            bottom=stack.pop()

            if stack:
                left=stack[-1]
                width=i-left-1
                h=min(arr[left],arr[i])-arr[bottom]
                water+=width*h
        
        stack.append(i)
    
    return water
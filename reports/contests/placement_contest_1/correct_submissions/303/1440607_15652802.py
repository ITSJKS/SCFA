def findEle(arr, i):
    for j in range(i + 1, len(arr)):
        if arr[j] > arr[i]:
            return arr[j]
    return -1
def nextGreaterElement(arr):
    stack = []
    for i in range(len(arr)):
        stack.append(findEle(arr, i))
    print(*stack)

    # result = [-1] * len(arr)
    # for i in range(len(arr) - 1, -1, -1):
    #     while stack and stack[-1] <= arr[i]:
    #         stack.pop()
    #     if not stack:
    #         stack.append(arr[i])
    #     result[i] = stack[-1]
    #     print(stack, result)
    # return result